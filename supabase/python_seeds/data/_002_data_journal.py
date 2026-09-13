"""Sample journal copy seeded by _002_seed_journal.py."""

from python_seeds.data._001_data_users import SEED_USER_ID

SITE_OWNER_ID = SEED_USER_ID
OWNER_SETTING_KEY = "owner_id"

HOME_INTRO = (
    "A public notebook. Short pieces, and longer ones when they earn the space."
)

ABOUT_BODY = """I write to keep the thinking honest — software, making things, and the long way around.

This site is the public shelf. If you are reading it, you are welcome to stay as long as a page is useful.
"""

POSTS = [
    {
        "id": "00000000-0000-0000-0001-000000000001",
        "slug": "why-this-site-exists",
        "title": "Why this site exists",
        "excerpt": "A small public notebook, not a product.",
        "published": True,
        "published_at": "2026-09-12T10:00:00+00:00",
        "body": """This is a place to put sentences I am willing to keep.

I do not need a platform for that. I need a page, a date, and the discipline to publish when the thought is finished — not when it is impressive.

If a piece is here, I meant it.
""",
    },
    {
        "id": "00000000-0000-0000-0001-000000000002",
        "slug": "a-short-note-on-tools",
        "title": "A short note on tools",
        "excerpt": "Use fewer tools. Finish the paragraph.",
        "published": True,
        "published_at": "2026-08-20T10:00:00+00:00",
        "body": """Tools multiply when the work is unclear.

The useful ones disappear into the sentence. The rest ask to be configured. I keep a short list and I let the unused ones go.

Writing still happens in the same place: a title, a body, a publish button.
""",
    },
    {
        "id": "00000000-0000-0000-0001-000000000003",
        "slug": "desk-notes",
        "title": "Desk notes",
        "excerpt": "An unpublished scrap.",
        "published": False,
        "published_at": None,
        "body": """This stays on the desk until it is ready.

Visitors should not see it. I should.
""",
    },
]


def published_slugs() -> list[str]:
    return [post["slug"] for post in POSTS if post["published"]]


def draft_slugs() -> list[str]:
    return [post["slug"] for post in POSTS if not post["published"]]
