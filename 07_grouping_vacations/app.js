const originalJSON = [];

const newJSON = [];

const vacations = {};

originalJSON.forEach((el) => {
  const userId = el.user._id;
  const userName = el.user.name;
  const vacation = {
    startDate: el.startDate,
    endDate: el.endDate,
  };

  if (!vacations[userId]) {
    vacations[userId] = {
      userId,
      userName,
      vacations: [],
    };
  }
  vacations[userId].vacations.push(vacation);
});

const newArr = Object.values(vacations);

console.log(JSON.stringify(newArr, null, 2));
