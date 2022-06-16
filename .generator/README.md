# Sonos generator

A lot of files in this library are generated, you can use the [@svrooij/sonos-docs](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs) generator.
With the template in the [./.generator/ts/](ts/) folder.

## (Re)generate files

```bash
# from root of repository!

# Generate the combined.json file (from online source), this is a combination of manual documentation and generated services.
npx @svrooij/sonos-docs combine

# Generate files in this library
npx @svrooij/sonos-docs generate ./.generator/ts/ ./

# Shortcut
npm run generate

```