## .Git 文件清理

### 1.查看仓库大小

```html
 git count-objects -v
// 查看文件代码库文件大小列表
 <!-- 
  git rev-list --objects --all \
| git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
| sed -n 's/^blob //p' \
| sort --numeric-sort --key=2 \
| cut -c 1-12,41- \
| $(command -v gnumfmt || echo numfmt) --field=2 --to=iec-i --suffix=B --padding=7 --round=nearest
 --> 


```

### 2.找出大文件

```js
git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -20 | awk '{print$1}')"
 
// 其中"tail -20"中的20表示条数。

```

### 3. 删除文件

```js
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch xxx.framework' --prune-empty --tag-name-filter cat -- --all
// 注意：xxx.framework 路径+文件名+带后缀
// 删除完成后在执行删除其他文件
```

### 4.清除缓存

~~~js
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now

~~~

> **注意：ERROR: cannot rewrite branches :youhave unstaged changes**
>
> ~~~js
> 解决：git status 先查看下 
> 执行：git stash 即可解决。
> ~~~

### 5.push到远程仓库

```
git push origin --force --all
```

> **注意：推送失败可能是远程仓库默认设置【分支保护】GItLab -->设置--> 仓库 --> protected Branches -->  点击 defualt 按钮 关闭即可**

___

