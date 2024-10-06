var DataBinder = function () {
	const MOVE_INDEX_VALUE = 9999;
	const self = this;
	const targetObjectMap = {};
	const targetObjectPrefix = "dataObject";
	const targetListPrefix = "dataList";
	let targetObjectIndex = 0;
	let targetListIndex = 0;
	let bindingElementMap = {};
  
	const targetProxy = new Proxy(targetObjectMap, {
	  set: function (target, key, value) {
		console.log(`${key} set to ${value}`);
		target[key] = value;
  
		if (bindingElementMap && bindingElementMap[key]) {
		  for (let i = 0; i < bindingElementMap[key].length; i++) {
			bindingElementMap[key][i].innerHTML = value;
		  }
		}
  
		return true;
	  },
	});
  
	const proxyModel = {
	  data: {},
	  dataList: {},
	};
	let lastMoveIndex = MOVE_INDEX_VALUE;
  
	self.docReady = function (callback) {
	  if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(callback, 1);
	  } else {
		document.addEventListener("DOMContentLoaded", callback);
	  }
	};
  
	self.updateRow = function (valueObject, rowElement) {
	  for (let key in valueObject) {
		let columns = rowElement.getElementsByClassName("lt-" + key);
		for (let i = 0; i < columns.length; i++) {
		  columns[i].innerHTML = valueObject[key];
		}
	  }
	};
  
	if (!("Proxy" in window)) {
	  console.warn("Your browser doesn't support Proxies.");
	  return;
	}
  
	const getAllChildElementIds = function (element, ids = []) {
	  if (element.classList.length > 0) {
		ids.push(element.classList[0]);
	  }
  
	  for (let child of element.children) {
		getAllChildElementIds(child, ids);
	  }
  
	  return ids;
	};
  
	const Observable = function (initialValue) {
	  const observable = this;
	  observable.objectName = targetObjectPrefix + targetObjectIndex;
	  observable.elementId = observable.objectName;
	  targetObjectIndex++;
  
	  if (initialValue) {
		targetObjectMap[observable.objectName] = initialValue;
	  }
  
	  return function (newValue, elementId) {
		if (elementId) {
		  observable.elementId = elementId;
		}
		if (!newValue) {
		  return targetObjectMap[observable.objectName];
		}
  
		targetProxy[observable.elementId] = newValue;
	  };
	};
  
	self.observable = function (initialValue) {
	  return new Observable(initialValue);
	};
  
	const ObservableList = function (initialList) {
	  const observableList = this;
	  const templateRowId = "table-row-id";
  
	  let elementBody, elementList, elementRow;
  
	  observableList.listName = targetObjectPrefix + targetListIndex;
	  observableList.elementId = "";
	  observableList.modelKey = "";
	  targetListIndex++;
	  observableList.isEditMode = false;
  
	  const cloneRow = function (valueObject) {
		if (!elementRow) return;
  
		const clone = elementRow.cloneNode(true);
		clone.id = templateRowId;
		clone.classList.remove("d-none");
		self.updateRow(valueObject, clone);
		elementBody.appendChild(clone);
	  };
  
	  if (!initialList) {
		initialList = [];
	  }
  
	  observableList.list = new Proxy(initialList, {
		deleteProperty: function (target, property) {
		  const propertyIndex = parseInt(property);
		  delete target[property];
  
		  if (lastMoveIndex == MOVE_INDEX_VALUE) {
			elementBody.deleteRow(propertyIndex + 1);
		  } else {
			elementBody.deleteRow(lastMoveIndex + 1);
		  }
  
		  console.log("Deleted %s", lastMoveIndex);
		  lastMoveIndex = MOVE_INDEX_VALUE;
		  return true;
		},
		set: function (target, property, value, receiver) {
		  target[property] = value;
		  const propertyIndex = parseInt(property);
  
		  if (property !== "length" && property !== "get_name" && property !== "set_edit_mode") {
			console.log("Set %s to %o", property, value);
  
			if (receiver.length == propertyIndex + 1 && observableList.isEditMode == false) {
			  if (!elementBody) return observableList.list;
  
			  cloneRow(value);
			} else {
			  if (observableList.isEditMode) {
				
				let oRowElement = document.getElementById(observableList.elementId + "-list").rows[propertyIndex + 2];
				dataBinder.updateRow(value, oRowElement); // update dom
				observableList.isEditMode = false;
				
			  } else {
				if (lastMoveIndex > propertyIndex) {
				  lastMoveIndex = propertyIndex;
				}
			  }
			}
		  }
		  return observableList.list;
		},
	  });
  
	  return function (newList, isEditMode, elementId) {
		if (typeof isEditMode === "boolean") {
		  observableList.isEditMode = isEditMode;
		}
		if (elementId) {
		  const partId = elementId.split("-");
		  const modelKey = partId[1];
  
		  observableList.elementId = elementId;
		  observableList.modelKey = modelKey;
  
		  if (bindingElementMap[modelKey] && bindingElementMap[modelKey].length > 0) {
			elementBody = bindingElementMap[modelKey][0];
			elementRow = elementBody.querySelector("#" + observableList.elementId + "-row");
			elementList = document.getElementById(observableList.elementId + "-list");
		  }
		}
		if (newList) {
		  observableList.list.splice(0, observableList.list.length);
		  observableList.list = newList;
		} else {
		  return observableList.list;
		}
	  };
	};
  
	self.observableList = function (initialList) {
	  return new ObservableList(initialList);
	};
  
	self.applyBindings = function (modelObject, rootElement) {
	  self.modelObject = modelObject;
  
	  const applyTextBinding = function (modelKey, modelValue, elementId) {
		modelValue(null, modelKey);
  
		if (!bindingElementMap[modelKey]) {
		  bindingElementMap[modelKey] = [];
		}
  
		let elementList = rootElement.getElementsByClassName(elementId);
  
		if (elementList.length === 0) {
		  console.log("Unable to bind element " + elementId + ". Element not found.");
		} else {
		  for (let i = 0; i < elementList.length; i++) {
			bindingElementMap[modelKey].push(elementList[i]);
		  }
		}
	  };
  
	  const applyListBinding = function (modelKey, modelList, elementId) {
		if (!bindingElementMap[modelKey]) {
		  bindingElementMap[modelKey] = [];
		}
  
		let elementList = rootElement.getElementsByClassName(elementId);
  
		if (elementList.length === 0) {
		  console.log("Unable to bind element " + elementId + ". Element not found.");
		} else {
		  for (let i = 0; i < elementList.length; i++) {
			bindingElementMap[modelKey].push(elementList[i]);
		  }
		}
  
		modelList(null, null, elementId);
	  };
  
	  const allIds = getAllChildElementIds(rootElement);
  
	  for (let i = 0; i < allIds.length; i++) {
		const elementId = allIds[i];
		const partId = elementId.split("-");
		const modelKey = partId[1];
		const modelType = partId[0];
  
		switch (modelType) {
		  case "t":
			if (!modelObject[modelKey]) {
			  modelObject[modelKey] = new self.observable();
			}
			applyTextBinding(modelKey, modelObject[modelKey], elementId);
			break;
		  case "l":
			if (!modelObject[modelKey]) {
			  modelObject[modelKey] = new self.observableList();
			}
			applyListBinding(modelKey, modelObject[modelKey], elementId);
			break;
		  case "s":
			if (!modelObject[modelKey]) {
			  modelObject[modelKey] = new self.observable();
			}
			applyTextBinding(modelKey, modelObject[modelKey], elementId);
			break;
		  case "f":
			if (!modelObject[modelKey]) {
			  modelObject[modelKey] = new self.observable();
			}
			applyTextBinding(modelKey, modelObject[modelKey], elementId);
			break;
		  default:
			break;
		}
	  }
  
	  proxyModel.data = self.observable(modelObject);
	  return proxyModel;
	};
  };
  