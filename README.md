# CA Tracker

This simple application helps track your remaining turnover (chiffre d'affaires) goals for the day, week and month. It stores sales and target information locally using JSON files.

## Installation

The tracker requires Python 3.8+. No external packages are needed.

```bash
python ca_tracker/cli.py --help
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
