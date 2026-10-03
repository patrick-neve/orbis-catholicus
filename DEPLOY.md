# Deploying to orbiscatholicus.catholicpat.com (Netlify)

1. Go to https://app.netlify.com/drop (sign in or create a free account).
2. Drag the `site/` folder (or unzip `orbiscatholicus-site.zip` and drag the folder it contains) onto the page.
3. In the new site: Site configuration -> Domain management -> Add a domain -> `orbiscatholicus.catholicpat.com`.
4. At the DNS provider for catholicpat.com add:  CNAME   orbiscatholicus   ->   <your-site-name>.netlify.app
5. Back in Netlify, click "Verify DNS" then "Provision certificate" for HTTPS (usually a few minutes).

To update later, drag the folder onto the site's Deploys page again.
