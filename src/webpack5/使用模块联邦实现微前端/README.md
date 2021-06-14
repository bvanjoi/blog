# 使用 webpack 模块联邦实现微前端

## 名词介绍

- 模块联邦(module federation) 是 webpack5 中的新功能，它是指多个独立的组件（即不存在依赖关系的组件）构成一个应用程序，由于其独立性，可以单独地开发和部署。

- 微前端(micro fronted) 是将多个单一的应用聚合为整个应用。实现微前端的方式多种多样，诸如 iframe, nginx 等等。

> 官网中明确指出，模块联邦不仅仅可以实现微前端，还可以实现 runtime 阶段的通信。

## 本文概要

本文主要目的是依据 module federation 实现一份可以运行的微前端 demo, 诸如原理细节等暂时不谈。

## demo 地址

见 [micro-fronted build on webpack-federation](https://github.com/bvanjoi/micro-fronted-build-on-webpack-federation)
