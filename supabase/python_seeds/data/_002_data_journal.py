"""Sample journal copy seeded by _002_seed_journal.py."""

from pathlib import Path

from python_seeds.data._001_data_users import SEED_USER_ID

SITE_OWNER_ID = SEED_USER_ID
OWNER_SETTING_KEY = "owner_id"
WHATSAPP_PHONE_KEY = "whatsapp_phone"
CONTACT_EMAIL_KEY = "contact_email"
WHATSAPP_PHONE = "15555550100"
CONTACT_EMAIL = "hello@example.com"

INTRO_PHOTO_BUCKET = "photos"
INTRO_PHOTO_OBJECT_PATH = "intro/waterfall_short_high_smile.jpg"
INTRO_PHOTO_CONTENT_TYPE = "image/jpeg"
INTRO_PHOTO_FILE = (
    Path(__file__).resolve().parent / "photos" / "waterfall_short_high_smile.jpg"
)
INTRO_PHOTO_URL_PLACEHOLDER = "__INTRO_PHOTO_URL__"

HOME_INTRO = """<p><strong>Welcome, glad you're here.</strong></p>
<div style="display:flex; flex-wrap:wrap; gap:1.75rem; align-items:flex-start; margin:1.5rem 0;">
  <div style="flex:0 0 180px;">
    <img src="__INTRO_PHOTO_URL__" alt="Purushottam" style="width:100%; max-width:180px; height:auto; border-radius:8px; display:block;" />
  </div>
  <div style="flex:1; min-width:240px;">
    <p style="margin:0;">I'm Purushottam — an AI agent engineer at Neuron7.ai, building an edtech tool, and working, slowly and deliberately, toward an independent research institution for the questions science hasn't fully claimed yet: reasoning, cognition, consciousness.</p>
  </div>
</div>
<p>This site is where I write in public — half-formed ideas, blogs, my projects, and things I'm still figuring out.</p>
<p>If something here resonates, say hello — you'll find me on WhatsApp or email just below.</p>
"""


def home_intro_body(photo_url: str) -> str:
    return HOME_INTRO.replace(INTRO_PHOTO_URL_PLACEHOLDER, photo_url)


ABOUT_BODY = """<p>I write to keep the thinking honest — software, making things, and the long way around.</p>
<p>This site is the public shelf. If you are reading it, you are welcome to stay as long as a page is useful.</p>
"""

POSTS = [
    {
        "id": "00000000-0000-0000-0001-000000000001",
        "slug": "why-this-site-exists",
        "title": "Why this site exists",
        "excerpt": "A small public notebook, not a product.",
        "published": True,
        "published_at": "2026-09-12T10:00:00+00:00",
        "kind": "writing",
        "body": """<p>This is a place to put sentences I am willing to keep.</p>
<p>I do not need a platform for that. I need a page, a date, and the discipline to publish when the thought is finished — not when it is impressive.</p>
<p>If a piece is here, I meant it.</p>
""",
    },
    {
        "id": "00000000-0000-0000-0001-000000000002",
        "slug": "a-short-note-on-tools",
        "title": "A short note on tools",
        "excerpt": "Use fewer tools. Finish the paragraph.",
        "published": True,
        "published_at": "2026-08-20T10:00:00+00:00",
        "kind": "writing",
        "body": """<p>Tools multiply when the work is unclear.</p>
<p>The useful ones disappear into the sentence. The rest ask to be configured. I keep a short list and I let the unused ones go.</p>
<p>Writing still happens in the same place: a title, a body, a publish button.</p>
""",
    },
    {
        "id": "00000000-0000-0000-0001-000000000003",
        "slug": "desk-notes",
        "title": "Desk notes",
        "excerpt": "An unpublished scrap.",
        "published": False,
        "published_at": None,
        "kind": "writing",
        "body": """<p>This stays on the desk until it is ready.</p>
<p>Visitors should not see it. I should.</p>
""",
    },
    {
        "id": "00000000-0000-0000-0001-000000000004",
        "slug": "this-site",
        "title": "This site",
        "excerpt": "A public journal, built in the open.",
        "published": True,
        "published_at": "2026-09-14T10:00:00+00:00",
        "kind": "project",
        "body": """<p>This site is the project I am willing to keep shipping.</p>
<p>Same tools as the writing: a title, a body, a publish button. The difference is only the shelf it sits on.</p>
""",
    },
]


def published_slugs() -> list[str]:
    return [post["slug"] for post in POSTS if post["published"]]


def draft_slugs() -> list[str]:
    return [post["slug"] for post in POSTS if not post["published"]]
