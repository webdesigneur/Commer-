import argparse
import json
from datetime import datetime, date, timedelta
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / ".."
TARGETS_FILE = DATA_DIR / "targets.json"
SALES_FILE = DATA_DIR / "sales.json"


def load_json(file_path, default):
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def set_targets(daily, weekly, monthly):
    targets = {"daily": daily, "weekly": weekly, "monthly": monthly}
    save_json(TARGETS_FILE, targets)
    print("Targets saved:", targets)


def add_sale(amount, sale_date=None):
    sale_date = sale_date or date.today().isoformat()
    sales = load_json(SALES_FILE, [])
    sales.append({"date": sale_date, "amount": amount})
    save_json(SALES_FILE, sales)
    print(f"Added sale of {amount} on {sale_date}")


def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def sum_sales(sales, start_date, end_date):
    total = 0
    for s in sales:
        d = parse_date(s["date"])
        if start_date <= d <= end_date:
            total += s["amount"]
    return total


def status(ref_date=None):
    ref_date = ref_date or date.today()
    targets = load_json(TARGETS_FILE, {"daily": 0, "weekly": 0, "monthly": 0})
    sales = load_json(SALES_FILE, [])

    start_of_day = ref_date
    end_of_day = ref_date

    start_of_week = ref_date - timedelta(days=ref_date.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    start_of_month = ref_date.replace(day=1)
    next_month = (start_of_month + timedelta(days=32)).replace(day=1)
    end_of_month = next_month - timedelta(days=1)

    day_total = sum_sales(sales, start_of_day, end_of_day)
    week_total = sum_sales(sales, start_of_week, end_of_week)
    month_total = sum_sales(sales, start_of_month, end_of_month)

    print("Status for", ref_date)
    print(f"Daily target:   {targets['daily']} | done: {day_total} | remaining: {max(targets['daily'] - day_total, 0)}")
    print(f"Weekly target:  {targets['weekly']} | done: {week_total} | remaining: {max(targets['weekly'] - week_total, 0)}")
    print(f"Monthly target: {targets['monthly']} | done: {month_total} | remaining: {max(targets['monthly'] - month_total, 0)}")


def main():
    parser = argparse.ArgumentParser(description="CA tracker")
    subparsers = parser.add_subparsers(dest="command")

    st = subparsers.add_parser("set-targets", help="Set CA targets")
    st.add_argument("daily", type=float)
    st.add_argument("weekly", type=float)
    st.add_argument("monthly", type=float)

    add = subparsers.add_parser("add", help="Add a sale")
    add.add_argument("amount", type=float)
    add.add_argument("--date", help="Date of sale YYYY-MM-DD")

    subparsers.add_parser("status", help="Show progress")

    args = parser.parse_args()

    if args.command == "set-targets":
        set_targets(args.daily, args.weekly, args.monthly)
    elif args.command == "add":
        add_sale(args.amount, args.date)
    else:
        status()


if __name__ == "__main__":
    main()
