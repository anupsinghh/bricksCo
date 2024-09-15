

export const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  };