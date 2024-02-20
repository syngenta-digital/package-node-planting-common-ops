# Cropwise Planting Common Ops Package

## About
In the context of backend of **Cropwise Planting**,  there are multiple services and more can be added in the future. But despite this multitude, many modules/functionalities will remain re-usable. Hence the purpose of this package is to separate out the common modules so that we can re-usable that code.

## Installation
As this is a package hosted on the private gemfury instance of syngenta, you need to tweak for *.yarnrc* or *.npmrc* files dependending on what you are using. You need to set the url of the private repository and the access token, which you can get by logging into the gemfury instance. At the moment of writing this, we are using *yarn*.  

**Yarn**

Your *.yarnrc.yml* should look something like this-
```yml
npmRegistries:

	//npm-proxy.fury.io/syngenta-digital:
	  npmAlwaysAuth: true
	  npmAuthToken: <<YOUR_PRIVATE_TOKEN>>

npmRegistryServer: "https://npm-proxy.fury.io/syngenta-digital/"
```
And then use the command-

    yarn add @syngenta-digital/planting-common-ops


## Deployment

You just need to create a tag in the format **release/SEMVER** where SEMVER is the standard *(MAJOR).(MINOR).(FIX)* type. Just check the previous deployed version and create the new git tag accordingly. If you create a tag with a SEMVER which is already deployed, it will cause a conflict and the deployment pipeline will fail. You can use the following commands for reference
```bash
git tag release/1.1.1  # Can be any valid semver actually
git push origin --tags
```

Also create a github release after every successful deployment. This is mainly for the convenience of developers and to generate the release notes.