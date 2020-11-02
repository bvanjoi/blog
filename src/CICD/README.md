# GitLab-CI/CD

## 介绍

### 什么是 CI/CD

- CI: Continuous Integration, 持续集成，对于存储在 Git 仓库的项目，开发者在开发不同功能代码时，可以频繁地将代码合并到一起且不影响工作。对于每一次提交，可以通过脚本来自动构建和测试代码，以减少出错概率。
- CD: CI 后的步骤
  - Continuous Delivery, 持续交付，CI 之后，可以手动部署。
  - Continuous Deployment, 持续部署，CI 之后，自动部署。

### 什么是 GitLab

GitLab 是一款基于 Git 的软件开发平台。

GitLab CI/CD 是集成在 GitLab 中的持续化工具。

## GitLab CI/CD 如何工作

为了使用 GitLab CI/CD, 首先要有一个托管在 Git 的代码仓库，之后在该仓库的根目录下创建配置文件 *.gitlab-ci.yml*, 该文件是一个用来描述构建，测试，部署的脚本。

*.gitlab-ci.yml* 中，可以定义依赖、顺序/并行执行的指令、部署应用的方式、手动/自动执行。

同时，在仓库中添加 *.gitlab-ci.yml* 文件后，当 push 到 GitLab 时，GitLab 将会检测该文件，并通过 GitLab Runner 执行该脚本。

示例：

```yml
before_script:  # 安装运行所需的依赖
  - apt-get install rubygems ruby-dev -y

run-test:       # 一个 job
  script:
    - ruby --version
```

以上代码中，`before_script` 和 `run-test` 组成了一个 pipeline.

## CI/CD 工作流

举个例子：

假如我们更改了代码，并 push 该 commit 到 GitLab, 则 pipeline 会被触发：运行脚本来构建和测试项目，预览每条 merge 的改变。一旦通过检查，则：code 可被 reviewed 和 approved, 当 merge 到默认分支时，GitLab CI/CD 将会自动改成生产环境，即使遇到错误，也能及时回滚。

![CI/CD 基本工作流](https://img-blog.csdnimg.cn/20201030161029635.png)
