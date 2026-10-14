# Tatsuya Takahashi — Portfolio

Jekyll renders this one-page portfolio from the YAML files in _data/. The page uses plain JavaScript and CSS, with no frontend framework. D3 v7.9.0 is vendored locally for the animated skills cloud; its license is in assets/js/D3-LICENSE.txt.

## Local preview

Install Ruby and Jekyll, then run gem install jekyll and jekyll serve.

Open the local URL printed by Jekyll (usually http://127.0.0.1:4000). GitHub Pages can build the site directly from the repository root.

## Editing content

All portfolio copy and facts live in YAML:

- _data/profile.yml — name, role, introduction, and portrait.
- _data/links.yml — LinkedIn, X, GitHub, Kaggle, and email URLs.
- _data/works.yml — the five featured projects and their images.
- _data/career.yml — career dates, roles, and descriptions.
- _data/skills.yml — the flat skills cloud list.
- _data/ui.yml — navigation, section headings, accessibility labels, and page titles in English and Japanese.

Localized copy keeps both en and ja values so language switching stays complete. The skill labels are product names and are shared between languages. The career dates are provisional and can be changed in _data/career.yml. The GitHub URL is a placeholder; replace it with the correct profile URL in _data/links.yml.

The cat portrait is assets/profile.png. The LETTER work image is the app icon from the LETTER iOS project. Citation Viewer, HUMANOID DJ, Python Live Coding, and DJ IWASHI use images supplied for this portfolio. Work images display as centered square thumbnails. Skill brand marks from Simple Icons v16.35.0 and Devicon v2.17.0 are bundled under assets/icons/skills/; their licenses and trademark notes are alongside them. Update image paths in _data/works.yml to replace work images.
