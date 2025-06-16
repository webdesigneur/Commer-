const { useState, useEffect } = React;

function loadTargets() {
  const t = localStorage.getItem('targets');
  return t ? JSON.parse(t) : { daily: 0, weekly: 0, monthly: 0 };
}

function saveTargets(t) {
  localStorage.setItem('targets', JSON.stringify(t));
}

function loadSales() {
  const s = localStorage.getItem('sales');
  return s ? JSON.parse(s) : [];
}

function saveSales(s) {
  localStorage.setItem('sales', JSON.stringify(s));
}

function sumSales(sales, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return sales.reduce((total, s) => {
    const d = new Date(s.date);
    if (d >= start && d <= end) {
      return total + Number(s.amount);
    }
    return total;
  }, 0);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
}

function endOfWeek(date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function startOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function SetTargets({ targets, onSave }) {
  const [daily, setDaily] = useState(targets.daily);
  const [weekly, setWeekly] = useState(targets.weekly);
  const [monthly, setMonthly] = useState(targets.monthly);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = { daily: Number(daily), weekly: Number(weekly), monthly: Number(monthly) };
    onSave(t);
  };

  return (
    React.createElement('section', null,
      React.createElement('h2', null, 'Set Targets'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', null,
          'Daily:',
          React.createElement('input', {
            type: 'number', value: daily, onChange: e => setDaily(e.target.value)
          })
        ),
        React.createElement('div', null,
          'Weekly:',
          React.createElement('input', {
            type: 'number', value: weekly, onChange: e => setWeekly(e.target.value)
          })
        ),
        React.createElement('div', null,
          'Monthly:',
          React.createElement('input', {
            type: 'number', value: monthly, onChange: e => setMonthly(e.target.value)
          })
        ),
        React.createElement('button', { type: 'submit' }, 'Save Targets')
      )
    )
  );
}

function AddSale({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [dateStr, setDateStr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      const entry = { amount: Number(amount), date: dateStr || new Date().toISOString().slice(0,10) };
      onAdd(entry);
      setAmount('');
      setDateStr('');
    }
  };

  return (
    React.createElement('section', null,
      React.createElement('h2', null, 'Add Sale'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('input', {
          type: 'number', placeholder: 'Amount', value: amount,
          onChange: e => setAmount(e.target.value)
        }),
        React.createElement('input', {
          type: 'date', value: dateStr,
          onChange: e => setDateStr(e.target.value)
        }),
        React.createElement('button', { type: 'submit' }, 'Add')
      )
    )
  );
}

function Status({ targets, sales }) {
  const today = new Date();
  const dayTotal = sumSales(sales, today, today);
  const weekTotal = sumSales(sales, startOfWeek(today), endOfWeek(today));
  const monthTotal = sumSales(sales, startOfMonth(today), endOfMonth(today));

  return (
    React.createElement('section', null,
      React.createElement('h2', null, 'Status for ' + today.toISOString().slice(0,10)),
      React.createElement('div', null,
        'Daily target: ', targets.daily, ' | done: ', dayTotal, ' | remaining: ', Math.max(targets.daily - dayTotal, 0)
      ),
      React.createElement('div', null,
        'Weekly target: ', targets.weekly, ' | done: ', weekTotal, ' | remaining: ', Math.max(targets.weekly - weekTotal, 0)
      ),
      React.createElement('div', null,
        'Monthly target: ', targets.monthly, ' | done: ', monthTotal, ' | remaining: ', Math.max(targets.monthly - monthTotal, 0)
      )
    )
  );
}

function App() {
  const [targets, setTargets] = useState(loadTargets());
  const [sales, setSales] = useState(loadSales());

  const saveTargetsState = (t) => {
    saveTargets(t);
    setTargets(t);
  };

  const addSale = (sale) => {
    const s = [...sales, sale];
    saveSales(s);
    setSales(s);
  };

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'CA Tracker'),
      React.createElement(SetTargets, { targets: targets, onSave: saveTargetsState }),
      React.createElement(AddSale, { onAdd: addSale }),
      React.createElement(Status, { targets: targets, sales: sales })
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
