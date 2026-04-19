export const preferenceOptions = [
    { name: 'femaleOnly',  label: 'Female Only',    desc: 'Ride is open to female passengers only',   color: 'pink' },
    { name: 'noSmoking',    label: 'No Smoking',      desc: 'No smoking allowed in the vehicle',        color: 'gray' },
    { name: 'quietRide',    label: 'Quiet Ride',      desc: 'Prefer a silent or low-noise journey',     color: 'blue' },
    { name: 'musicOk',      label: 'Music OK',        desc: 'Music will be played during the ride',     color: 'purple' },
    { name: 'petsAllowed',  label: 'Pets Allowed',    desc: 'Small pets are welcome',                   color: 'yellow' },
    { name: 'noEating',     label: 'No Eating',       desc: 'Please refrain from eating in the car',    color: 'orange' },
    { name: 'acRequired',   label: 'AC Required',     desc: 'Air conditioning will be on',              color: 'cyan' },
    { name: 'studentOnly',  label: 'Students Only',   desc: 'Ride is exclusively for students',         color: 'green' },
];

export const nameToOption = preferenceOptions.reduce((acc, opt) => {
  acc[opt.name] = opt;
  return acc;
}, {});
