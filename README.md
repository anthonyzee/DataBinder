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

```html
<script src="path/to/DataBinder.js"></script>
