export const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInTime = endDate.getTime() - startDate.getTime();
  return Math.round(diffInTime / (1000 * 3600 * 24));
};

export const computeLoanDetails = (amount, startDate, endDate) => {
  const numAmount = Number(amount) || 0;
  const days = calculateDays(startDate, endDate);
  const weeks = Math.max(1, Math.floor(days / 7));

  //10 percent/100percennt/ 30 days
  const percentage_interest = 10;
  const interestRate = percentage_interest / 100 / 30;
  const dailypercent = interestRate;

  const dailyinterest = numAmount * dailypercent;
  const totalInterest = dailyinterest * days;
  const totalRepayable = numAmount + totalInterest;
  const weeklyPay = totalRepayable / weeks;

  console.log(`Daily rate ${dailyinterest}`);
  console.log(`totalInterest ${totalInterest}`);
  console.log(`totalRepayable ${totalRepayable}`);
  console.log(`weeklyPay ${weeklyPay}`);

  return {
    days,
    weeks,
    interest: totalInterest.toFixed(2),
    total: totalRepayable.toFixed(2),
    weekly: weeklyPay.toFixed(2),
    periodText: `${weeks} weeks (${days} days)`,
  };
};
