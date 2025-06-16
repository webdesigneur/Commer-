# CA Tracker

This simple application helps track your remaining turnover (chiffre d'affaires) goals for the day, week and month. It stores sales and target information locally using JSON files.

## Installation

The tracker requires Python 3.8+. No external packages are needed.

```bash
python ca_tracker/cli.py --help
```

Alternatively you can run a very simple menu-driven interface:

```bash
python simple_ui.py
```

## Usage

1. **Set targets**:

```bash
python ca_tracker/cli.py set-targets DAILY_TARGET WEEKLY_TARGET MONTHLY_TARGET
```

Example:

```bash
python ca_tracker/cli.py set-targets 500 3000 12000
```

2. **Add a sale**:

```bash
python ca_tracker/cli.py add AMOUNT [--date YYYY-MM-DD]
```

Omit `--date` to use today's date.

3. **Check status**:

```bash
python ca_tracker/cli.py status
```

The command outputs the turnover achieved and the remaining amount needed for the day, week and month.

All data is saved in `targets.json` and `sales.json` in the project root.

## React UI

A lightweight React front-end is provided in the `react_app` folder. It performs the same actions (set targets, add sales and show status) using `localStorage` for persistence.

To try it out simply open `react_app/index.html` in your browser.
