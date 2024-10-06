
# DataBinder

A lightweight JavaScript library for creating two-way data bindings between your HTML elements and JavaScript objects using Proxies.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Observable](#observable)
  - [Observable List](#observable-list)
  - [DataBinder Methods](#databinder-methods)
- [Example Usage](#example-usage)
- [License](#license)

## Introduction

`DataBinder` is a simple library that allows you to bind data between your JavaScript objects and DOM elements with ease. It utilizes JavaScript Proxies to watch changes on objects and automatically updates the DOM when data is modified. This is especially useful for building dynamic and reactive UI components without the need for complex frameworks.

## Features

- Two-way data binding between JavaScript objects and HTML elements.
- Observable properties for individual values.
- Observable lists for arrays of objects.
- Lightweight and easy to integrate with existing projects.
- Supports both text-based and list-based bindings.

## Installation

Include `DataBinder.js` in your HTML file:

\```html
<script src="path/to/DataBinder.js"></script>
\```

Alternatively, you can download or clone the repository from GitHub and include the script manually.

## Getting Started

Follow these steps to get started with `DataBinder`:

1. Initialize a new instance of `DataBinder`.
2. Create observable properties or lists.
3. Apply bindings to your HTML elements.
4. Modify the properties or lists and see the changes reflected in the UI.

## API Reference

### Observable

`DataBinder.observable(initialValue)`

Creates a new observable property that can be bound to HTML elements.

- **Parameters**:
  - `initialValue` (optional): The initial value of the observable property.
  
- **Returns**: A function that can be used to get or set the value of the observable.

**Example:**

\```javascript
var dataBinder = new DataBinder();
var observableProperty = dataBinder.observable("Initial Value");

observableProperty("Updated Value"); // Sets the value
console.log(observableProperty());   // Gets the value
\```

### Observable List

`DataBinder.observableList(initialList)`

Creates a new observable list that can be bound to a list of HTML elements, such as rows in a table.

- **Parameters**:
  - `initialList` (optional): An initial array of objects for the observable list.

- **Returns**: A proxy that allows you to manipulate the list and automatically update the HTML.

**Example:**

\```javascript
var observableList = dataBinder.observableList([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
observableList().push({ a: 5, b: 6 }); // Adds a new item to the list
observableList()[0] = { a: 10, b: 20 }; // Modifies the first item in the list
\```

### DataBinder Methods

#### `DataBinder.docReady(callback)`

Executes the callback function once the DOM is fully loaded.

- **Parameters**:
  - `callback`: The function to be executed when the DOM is ready.

#### `DataBinder.applyBindings(modelObject, rootElement)`

Applies the bindings between the `modelObject` and HTML elements within the `rootElement`.

- **Parameters**:
  - `modelObject`: An object containing observables or observable lists.
  - `rootElement`: The root HTML element where bindings should be applied.

**Example:**

\```javascript
dataBinder.applyBindings(modelObject, document.getElementById("container"));
\```

## Example Usage

Here's a simple example to demonstrate the usage of `DataBinder`:

\```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DataBinder Example</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="DataBinder.js"></script>
    <script>
        var dataBinder = new DataBinder();
        var model = {};

        // Create observables for text values
        model.title = dataBinder.observable("Hello, World!");
        model.subtitle = dataBinder.observable("Subtitle goes here");

        // Create an observable list
        model.items = dataBinder.observableList([{ a: 1, b: 2 }, { a: 3, b: 4 }]);

        dataBinder.docReady(function () {
            // Apply the bindings to the container element
            dataBinder.applyBindings(model, document.getElementById("data-container"));
        });

        function addItem() {
            model.items().push({ a: Math.random(), b: Math.random() });
        }
    </script>
</head>
<body>
    <div id="data-container" class="container">
        <h1 class="t-title">Title</h1>
        <h3 class="t-subtitle">Subtitle</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Column A</th>
                    <th>Column B</th>
                </tr>
            </thead>
            <tbody class="l-items">
                <tr id="l-items-row" class="d-none">
                    <td class="lt-a">Value A</td>
                    <td class="lt-b">Value B</td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-primary" onclick="addItem();">Add Item</button>
    </div>
</body>
</html>
\```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
