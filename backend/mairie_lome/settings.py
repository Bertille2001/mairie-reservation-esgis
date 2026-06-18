from pathlib import Path
from datetime import timedelta

# ─── Chemins ───────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Sécurité ──────────────────────────────────────────────
SECRET_KEY = "dev_secret_key_mairie_lome_2026_changer_en_prod"
DEBUG = True
ALLOWED_HOSTS = ["*"]

# ─── Applications ──────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Packages
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    # Nos apps
    "apps.utilisateurs",
    "apps.salles",
    "apps.reservations",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "mairie_lome.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
        "context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ],
    },
}]

WSGI_APPLICATION = "mairie_lome.wsgi.application"

# ─── Base de données ───────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE":   "django.db.backends.postgresql",
        "NAME":     "mairie_lome_db",
        "USER":     "postgres",
        "PASSWORD": "biasa2026",
        "HOST":     "localhost",
        "PORT":     "5432",
        "OPTIONS": {
            "client_encoding": "UTF8",
        },
    }
}

# ─── Modèle utilisateur custom ─────────────────────────────
AUTH_USER_MODEL = "utilisateurs.Utilisateur"

# ─── Django REST Framework ─────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
    ),
}

# ─── JWT ───────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ─── CORS ──────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

# ─── Email (console pour le dev, pas besoin de SMTP) ───────
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "noreply@mairie-lome.tg"

# ─── Internationalisation ──────────────────────────────────
LANGUAGE_CODE = "fr-fr"
TIME_ZONE     = "Africa/Lome"
USE_I18N      = True
USE_TZ        = True

STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
