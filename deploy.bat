
cd docs/.vuepress/dist

echo blog.wangu2.com > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/wangu2/wangu2.github.io.git master
