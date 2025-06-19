import React, { useState, useEffect } from 'react';
import './App.css';

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
    <section>
      <h2>Set Targets</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Daily:
          <input
            type="number"
            value={daily}
            onChange={(e) => setDaily(e.target.value)}
          />
        </div>
        <div>
          Weekly:
          <input
            type="number"
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
          />
        </div>
        <div>
          Monthly:
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
          />
        </div>
        <button type="submit">Save Targets</button>
      </form>
    </section>
  );
}

function AddSale({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [dateStr, setDateStr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      const entry = {
        amount: Number(amount),
        date: dateStr || new Date().toISOString().slice(0, 10),
      };
      onAdd(entry);
      setAmount('');
      setDateStr('');
    }
  };

  return (
    <section>
      <h2>Add Sale</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}

function Status({ targets, sales }) {
  const today = new Date();
  const dayTotal = sumSales(sales, today, today);
  const weekTotal = sumSales(sales, startOfWeek(today), endOfWeek(today));
  const monthTotal = sumSales(sales, startOfMonth(today), endOfMonth(today));

  return (
    <section>
      <h2>Status for {today.toISOString().slice(0, 10)}</h2>
      <div>
        Daily target: {targets.daily} | done: {dayTotal} | remaining:{' '}
        {Math.max(targets.daily - dayTotal, 0)}
      </div>
      <div>
        Weekly target: {targets.weekly} | done: {weekTotal} | remaining:{' '}
        {Math.max(targets.weekly - weekTotal, 0)}
      </div>
      <div>
        Monthly target: {targets.monthly} | done: {monthTotal} | remaining:{' '}
        {Math.max(targets.monthly - monthTotal, 0)}
      </div>
    </section>
  );
}

export default function App() {
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
    <div>
      <h1>CA Tracker</h1>
      <SetTargets targets={targets} onSave={saveTargetsState} />
      <AddSale onAdd={addSale} />
      <Status targets={targets} sales={sales} />
    </div>
  );
}
