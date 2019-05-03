# 📦📌 npmajor

Install npm packages while keeping only their major version in package.json

![npmajor-caption](https://user-images.githubusercontent.com/4168389/57152940-4be0dc00-6dd5-11e9-9e2c-f307935b1918.gif)

## Installation

```
npm i -g npmajor
```

## Usage

### To install dependencies

All the following commands are a valid way to install packages on dependencies.

```
npmajor <packages ...>
npmajor i <packages ...>
npmajor install <packages ...>
```

### To install devDependencies

Use official `--save-dev` flag to install packages on devDependencies. Alias `-D` is also available.

```
npmajor --save-dev <packages ...>
npmajor i --save-dev <packages ...>
npmajor install --save-dev <packages ...>
```
