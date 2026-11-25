# The browser tests in the same image CI uses, for a local check before pushing.
#
#   npm run test:docker
#
# A local run only reports. The baselines in tests/__screenshots__/linux/ are recorded and judged by
# CI alone: screenshots differ slightly between machines (CPU architecture among them), so nothing
# produced here is committed.
#
# The build context is the repo root. Tests and library are baked into the image, so the image is
# rebuilt on every run; the dependency layer stays cached while the lockfile does not change.
#
# The tag must match the @playwright/test devDependency: the browsers are baked into the image.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

# there is no .git in the build context, so the husky prepare script has nothing to install into
ENV HUSKY=0
# judge like CI: no baseline is recorded, a missing one fails
ENV CI=1

WORKDIR /repo

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

COPY . .

# the showcase app the leak and SSR tests drive serves the wasm from static/
RUN npx svelte-kit sync && npm run copyWasm

CMD ["npm", "test"]
