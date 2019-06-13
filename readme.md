# Concentric Design Marketing Website

## Key Technologies and Integrations
- [Siteleaf](https://siteleaf.com) CRM
- [Github](https://github.com/ConcentricDesign/website) Code repository
- [Jekyll](https://jekyllrb.com/) static site generator
- [Liquid](https://help.shopify.com/en/themes/liquid) HTML templating
- [Bootstrap](https://getbootstrap.com/docs/3.3/css/#grid) CSS grid
- [SASS](https://sass-lang.com/guide) CSS preprocessing

## Making General Changes
Superficial changes can be made to the site using Siteleaf, which provides a GUI for modifying `*.markdown` files. All changes made in Siteleaf will be automatically synced with the `master` branch of the Concentric Github repository.

## Local Development
To develop locally:
1. Follow any setup steps documented on Jekyll's website (see above) as you will need to run a jekyll server locally
2. Checkout the Concentric code repo from Github (see link above)
3. Launch the server using command `jekyll server`
4. View the local website in a browser at [http://127.0.0.1:4000](http://127.0.0.1:4000)

All changes to `*.markdown`, `*.html`, `*.scss`, `*.css` and `*.js` files will trigger a refresh of the server and the website will be automatically reloaded with the latest files. When files are committed to `master`, the changes will be automatically picked up by Siteleaf's Github monitoring.

## Prod Deployment

#### Topology and Deployment
Production includes an AWS S3 bucket fronted by AWS Cloudfront (for caching and SSL certificate). The site is deployed using Siteleaf which will generate the site's files from the latest code in Github and upload them to AWS S3.

When new static files are deployed to the AWS S3 bucket it may take up to 24 hours for the Cloudfront cache to be refreshed ([Cloudfront caching detail](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html)). To force Cloudfront to serve up the latest file(s) without waiting for the cache to be automatically updated, its cache must be manually invalidated.

###### Invalidate Cloudfront Cache
As of June 13, 2019, the process to invalidate the cache for all site files is as follows:
1. Go to [AWS Cloudfront](https://console.aws.amazon.com/cloudfront/home)
2. Select the Concentric website distribution from the list using the checkbox
3. Choose **Distribution Settings**
4. Go to **Invalidations** tab
5. Choose **Create Validation**
6. Enter `/*` into the **Object Paths** field
7. Click **Invalidate** to process the invalidation

For more information on invalidating specific files and directories see the **Invalidation Paths** section of [this page](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html#invalidation-specifying-objects) to view examples of the syntax. Note that invalidation count is a priced feature of Cloudfront, although this site is likely to always stay within free tier usage ([Cloudfront pricing](https://aws.amazon.com/cloudfront/pricing/)).
