#!/bin/sh

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

# Cleanup (for those who don't use a CI).
rm -rf public

# Clone original repository.
git clone https://${GH_TOKEN}:x-oauth-basic@github.com/howtoadhd/satis.git public


# Attempt to switch to the deployment branch.
cd public/
git checkout gh-pages
if [ 0 != $? ]; then
  # Create a new orphan branch to track deployments
  git checkout --orphan gh-pages

  # Everything is being tracked, so remove it
  git rm --cached -r ./

  # Use special ignore for deploy.
  mv .satisignore .gitignore
fi


# Build static `composer` repository with `composer/satis`.
cd ..
composer run-script install-deps
composer run-script build

# Deploy to Github Pages.
cd public/
git add --all
git commit -m "Deploy Satis: Build ${TRAVIS_BUILD} @ `date -u`"
git push -f -u origin gh-pages

# Cleanup (for those who don't use a CI).
cd ..
rm -rf public
