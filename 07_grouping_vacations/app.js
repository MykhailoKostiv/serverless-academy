const originalJSON = [
  {
    _id: "6196a33a3a853300128602eb",
    user: {
      _id: "60b7c1f04df06a0011ef0e76",
      name: "Laurence Knox",
    },
    usedDays: 3,
    startDate: "2021-11-19",
    endDate: "2021-11-23",
  },
  {
    _id: "61a3c3bb3a85330012864b5b",
    user: {
      _id: "60b7c1f04df06a0011ef0e76",
      name: "Laurence Knox",
    },
    usedDays: 2,
    startDate: "2021-12-09",
    endDate: "2021-12-10",
  },
];

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
