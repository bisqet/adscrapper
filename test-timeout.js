function delay(mseconds) {
  console.log('Pausing for', mseconds / 1000, 'seconds...' );
  return new Promise(resolve => {
    setTimeout(() => resolve(), mseconds); 
  });
}

const main = (async () => {
  console.log('main');
  await delay(5000);
  throw 'shit!';
});

function mainWrapper() {
  main()
  .then(async () => {
    console.log('main then');
    await delay(5000);
    console.log('done [then]');
    console.log('calling main again!');
    mainWrapper();

  })
  .catch(async (err) => {
    console.log('main catch - error:', err);
    await delay(5000);
    console.log('done [err]');
    console.log('calling main again!');
    mainWrapper();
  });
  
}

mainWrapper();