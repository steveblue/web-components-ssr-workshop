import copyfiles from 'copyfiles';

const files = ['robots.txt', 'dist'];

copyfiles(files, true, () => {});
