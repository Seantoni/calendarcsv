document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('date-form');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const daysOfWeek = document.querySelectorAll('input[name="day-of-week"]');
    const selectAll = document.getElementById('select-all');
    const optionName = document.getElementById('option-name');
    const availability = document.getElementById('availability');

    // Add event listener to "Select All" checkbox
    selectAll.addEventListener('change', () => {
      const isChecked = selectAll.checked;
      daysOfWeek.forEach(dayOfWeek => {
        dayOfWeek.checked = isChecked;
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Get the start and end dates from the input fields
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      // Get an array of the selected days of the week
      const selectedDaysOfWeek = [];
      daysOfWeek.forEach(dayOfWeek => {
        if (dayOfWeek.checked && dayOfWeek.value !== 'all') {
          selectedDaysOfWeek.push(dayOfWeek.value);
        }
      });

      // Generate the dates for the selected days of the week
      const dates = generateDates(start, end, selectedDaysOfWeek);

      // Calculate the availability value
      const totalAvailability = Number(availability.value);
      const rows = dates.length;
      const availPerRow = Math.floor(totalAvailability / rows);

      // Download the CSV file
      downloadCSV(dates, optionName.value, availPerRow);
    });
  });

  function generateDates(start, end, selectedDaysOfWeek) {
    const dates = [];
    const oneDay = 24 * 60 * 60 * 1000;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (selectedDaysOfWeek.includes(d.getDay().toString())) {
        const dateObj = { date: formatDate(d), day: d.toLocaleString('en-US', { weekday: 'long' }) };
        dates.push(dateObj);
      }
    }

    return dates;
  }

  function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }

  function downloadCSV(dates, optionName, availPerRow) {
    const filename = `${optionName}.csv`;
    const csvContent = 'data:text/csv;charset=utf-8,date,Day,quantity\n' + dates.map(dateObj => `${dateObj.date},${dateObj.day},${availPerRow}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    link.click();
  }
