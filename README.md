# Tatsuya Takahashi — Portfolio

Jekyll renders this one-page portfolio from the YAML files in _data/. The page uses plain JavaScript and CSS, with no frontend framework or runtime package dependencies.

## Local preview

Install Ruby and Jekyll, then run gem install jekyll and jekyll serve.

Open the local URL printed by Jekyll (usually http://127.0.0.1:4000). GitHub Pages can build the site directly from the repository root.

## Editing content

All portfolio copy and facts live in YAML:

- _data/profile.yml — name, role, introduction, and portrait.
- _data/links.yml — LinkedIn, X, GitHub, Kaggle, and email URLs.
- _data/works.yml — the five featured projects and their images.
- _data/career.yml — career dates, roles, and descriptions.
- _data/skills.yml — skill groups and labels.
- _data/ui.yml — navigation, section headings, accessibility labels, and page titles in English and Japanese.

Edit both en and ja values to keep language switching complete. The career dates are provisional and can be changed in _data/career.yml. The GitHub URL is a placeholder; replace it with the correct profile URL in _data/links.yml.

The cat portrait is assets/profile.png. The LETTER work image is the app icon from the LETTER iOS project. Citation Viewer, HUMANOID DJ, Python Live Coding, and DJ IWASHI use images supplied for this portfolio. Work images display as centered square thumbnails. Update image paths in _data/works.yml to replace them.
