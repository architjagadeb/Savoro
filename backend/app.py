from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

app = Flask(__name__, template_folder="templates", static_folder="static")

# Secret key (needed for sessions & Flask-Login)
app.config["SECRET_KEY"] = "yoursecretkey"  

# SQLite database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///savoro.db"
db = SQLAlchemy(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.login_view = "login"  # redirect if not logged in
login_manager.init_app(app)

# -------------------- MODELS --------------------
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# -------------------- ROUTES --------------------

# Home
@app.route("/")
def home():
    return render_template("index.html")

# Meal Planner
@app.route("/meal-planner")
def meal_planner():
    return render_template("meal-planner.html")

# Recipes
@app.route("/recipes")
def recipes():
    return render_template("recipes.html")

# Favorites
@app.route("/favorites")
@login_required
def favorites():
    return render_template("favorites.html")

# About
@app.route("/about")
def about():
    return render_template("about.html")

# Pricing
@app.route("/pricing")
def pricing():
    return render_template("pricing.html")

# -------------------- AUTH ROUTES --------------------

# REGISTER
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if not username or not email or not password:
            flash("All fields are required", "danger")
            return render_template("register.html")

        if User.query.filter_by(username=username).first():
            flash("Username already exists", "warning")
            return render_template("register.html")

        if User.query.filter_by(email=email).first():
            flash("Email already registered", "warning")
            return render_template("register.html")

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully! Please log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

# LOGIN
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash(f"Welcome back, {user.username}!", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password", "danger")

    return render_template("login.html")

# LOGOUT
@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("home"))

# DASHBOARD
@app.route("/dashboard")
@login_required
def dashboard():
    # Fake data for demonstration
    recent_meals = [
        {"id": 1, "name": "Pasta", "date": "2025-08-22"},
        {"id": 2, "name": "Salad", "date": "2025-08-21"},
    ]

    recommended_recipes = [
        {"id": 1, "name": "Tomato Soup"},
        {"id": 2, "name": "Grilled Sandwich"},
    ]

    weekly_meals = [2, 3, 1, 4, 3, 2, 0]  # Monday → Sunday

    return render_template(
        "dashboard.html",
        current_user=current_user,
        recent_meals=recent_meals,
        recommended_recipes=recommended_recipes,
        weekly_meals=weekly_meals
    )

# -------------------- RUN --------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # ensures savoro.db is created
    app.run(debug=True)
