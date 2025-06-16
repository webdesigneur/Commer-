import sys
from ca_tracker.cli import set_targets, add_sale, status


def prompt_float(message):
    while True:
        try:
            return float(input(message))
        except ValueError:
            print("Please enter a valid number.")


def prompt_date(message):
    date = input(message + " (YYYY-MM-DD, leave blank for today): ")
    return date or None


def main():
    while True:
        print("\nCA Tracker")
        print("1. Set targets")
        print("2. Add sale")
        print("3. Show status")
        print("4. Exit")
        choice = input("Choose an option: ")

        if choice == "1":
            daily = prompt_float("Daily target: ")
            weekly = prompt_float("Weekly target: ")
            monthly = prompt_float("Monthly target: ")
            set_targets(daily, weekly, monthly)
        elif choice == "2":
            amount = prompt_float("Sale amount: ")
            date_str = prompt_date("Date")
            add_sale(amount, date_str)
        elif choice == "3":
            status()
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid choice, try again.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
