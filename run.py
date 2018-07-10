#!/usr/bin/python
#coding:utf-8
import os,sys,platform,subprocess,time,json

#fepack 集成
with open('fepack.json') as f:
    fedogConfig = json.loads(f.read())

#判断当前系统
isWindows = 'Windows' == platform.system()

#前端项目名
project = fedogConfig['release']['project']

#后端分支模板所在目录
beRelease = fedogConfig['deploy']['beRelease']

#后端分支静态文件所在目录
# staticBeRelease = fedogConfig['deploy']['staticBeRelease']

#前端上线发布分支所在目录
feRelease = '../fe-release-group/'

#前端上线发布分支地址
feReleaseGit = fedogConfig['deploy']['feReleaseGit']

#初始化目录
def initDir():
    if not os.path.exists(feRelease):
        exeCmd('mkdir ' + feRelease)

#获取当前git分支
def getGitBranch():
    branches = subprocess.check_output(['git', 'branch']).split('\n')
    for b in branches[0:-1]:
        if b[0] == '*':
            return b.lstrip('* ')

    return None


def exeCmd(cmd):
    print '------------------------------------------------------'
    print cmd
    os.system(cmd)

def releaseDev():
    print 'release to dev'
    exeCmd('fepack release dev')

def releaseQa():
    print 'release to 192.168.50.107 start...'
    bakTmp = fedogConfig['release']['cases']['qa']['www']

    #删除遗留的__dist
    exeCmd('rm -rf ' + bakTmp)

    #进行打包编译
    cmd = 'fepack release qa'
    exeCmd(cmd)

    #把vm文件拷贝到后端工程
    #cmd = 'scp -r ' + os.path.join(bakTmp, project, 'page') + ' ' + beRelease
    #exeCmd(cmd)

    #拷贝静态资源到测试服务器
    cmd = 'scp -r ' + os.path.join(bakTmp, project) + ' root@192.168.50.107:/opt/soft/tengine/html/mljr/'
    exeCmd(cmd)

    cmd = 'rm -rf ' + bakTmp
    exeCmd(cmd)

    print 'release to 192.168.50.107 end'


def releaseBackend():
    print 'release to backend start...'
    bakTmp = fedogConfig['release']['cases']['qa']['www']

    #删除遗留的__dist
    exeCmd('rm -rf ' + bakTmp)

    #进行打包编译
    cmd = 'fepack release qa'
    exeCmd(cmd)

    #把vm文件拷贝到后端工程
    exeCmd('mkdir -p ' + beRelease)
    cmd = 'scp -r ' + os.path.join(bakTmp, project, 'page') + ' ' + beRelease
    exeCmd(cmd)

    #拷贝静态资源到后端工程
    exeCmd('mkdir -p ' + staticBeRelease + project)
    cmd = 'scp -r ' + os.path.join(bakTmp, project, 'static') + ' ' + staticBeRelease + project
    exeCmd(cmd)

    cmd = 'rm -rf ' + bakTmp
    exeCmd(cmd)

    print 'release to backend end'

def releaseOnline():
    print 'release to fe-release start...'
    bakTmp = fedogConfig['release']['cases']['www']['www']

    #检测是否在master分支
    if getGitBranch() != 'master':
        print 'please merge to master!'
        return

    #删除遗留的__dist
    exeCmd('rm -rf ' + bakTmp)

    #进行打包编译
    cmd = 'fepack release www'
    exeCmd(cmd)

    #删除原有release目录并且clone最新的
    currPath = os.getcwd()
    os.chdir(os.path.join(currPath, feRelease))

    exeCmd('rm -rf ' + project)
    exeCmd('git clone ' + feReleaseGit)

    #将打包编译的文件拷贝到fe-release
    os.chdir(currPath)
    exeCmd('rm -rf ' + os.path.join(feRelease, project, "*"))

    cmd = 'scp -r ' + os.path.join(bakTmp, project, '*') + ' ' + os.path.join(feRelease, project)
    exeCmd(cmd)

    cmd = 'scp -r ' + os.path.join(bakTmp, project, 'page') + ' ' + os.path.join(feRelease, project)
    exeCmd(cmd)

    #切到fe-release git push
    os.chdir(os.path.join(currPath, feRelease, project))
    exeCmd('git add .')
    exeCmd('git commit -m "auto commit" *')
    exeCmd('git push')

    #打tag
    exeCmd('git tag www/' + project + '/' + time.strftime('%Y%m%d.%H%M'))
    exeCmd('git push --tags')

    #切回到当前目录
    os.chdir(currPath)
    cmd = 'rm -rf ' + bakTmp
    exeCmd(cmd)

    print 'release to fe-release end'

def main():
    initDir()

    argv = sys.argv
    if len(argv) == 1:
        exeCmd('fepack server start')
        return

    cmdType = sys.argv[1]

    if cmdType == 'dev':
        releaseDev()

    elif cmdType == 'qa':
        releaseQa()

    elif cmdType == 'www':
        releaseOnline()

    elif cmdType == 'backend':
        releaseBackend()

    else:
        print 'please choose one : dev,qa,www,backend'

if __name__ == "__main__":
    main()
