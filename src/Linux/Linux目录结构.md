# Linux 目录结构

Linux 只有一个根目录，在根目录下多个文件夹：

![阿里云轻量级应用服务器的根目录](https://img-blog.csdnimg.cn/2021062915312538.png)

其中各个目录的作用为：

- /root: root 用户的目录；
- /home: 普通用户（例如创建的用户）的目录；
- /bin: Binary 的缩写，里面存放常用的命令，一般有两个文件夹：/usr/bin, /usr/local/bin.
- /etc: 配置文件；
- /lib: 开机时所需的最基本的动态链接 Windows 的 DLL 文件，几乎所有的应用程序都要用到这些共享库。
- /usr: 用户的应用程序和文件都放在该 Windows 下的 Program File.
- /boot: Linux 启动时的引导文件。
- /proc: 虚拟目录，系统内存的映射。
- /srv: service 的缩写，存放一些服务
- /sys: Linux 2.6 内核中新出现的一个
- /tmp: 存放临时文件。
- /dev: 设备管理器，把所有的硬件以文件形式存储，因此说 Linux中一切皆文件。
- /media: Linux 自动识别的一些设备， U盘，识别后会被自动挂载道改目录下。
- /mnt: 让用户临时挂载别的文件系统的
- /opt: 安装软件存放的目录。
- /usr/loca: 安装软件所安装的目录。
- /var: 存放不断扩充的东西，例如日志
- /selinux: 安全子系统，它控制程序只能访问只能的文件
- …

可见， Linux 中目录是被详细规划的。
