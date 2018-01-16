default:
	composer install
	vendor/bin/satis build ./satis.json ./tmp
	cp -R ./jekyll/* ./tmp/
	cd ./tmp; bundle install --jobs=3 --retry=3
	cd ./tmp; bundle exec jekyll build --destination ../public
