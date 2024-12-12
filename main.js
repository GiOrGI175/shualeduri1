#! /usr/bin/env node

import { Command } from 'commander';
import { readFile, writeFile } from './utiles/utiles.js';

const program = new Command();

program
  .command('create')
  .option('--category <category>')
  .option('--name <name>')
  .option('--price <price>')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);

    const lastId = items[items.length - 1]?.id || 0;

    const newItem = {
      id: lastId + 1,
      date: new Date(),
    };

    if (opts.category) newItem.category = opts.category;
    if (opts.name) newItem.name = opts.name;
    if (Number(opts.price) < 10) {
      console.log('min price is 10');
      return;
    } else {
      newItem.price = opts.price;
    }

    items.push(newItem);
    await writeFile('shopItems.json', items, true);
    console.log('item create succesfully');
  });

program
  .command('show')
  .option('--asc')
  .option('--desc')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);

    if (opts.asc) {
      const sortedItems = items.sort((a, b) => a.date - b.date);

      const filteredItems = JSON.stringify(sortedItems, null, 2);

      console.log(filteredItems);
    } else if (opts.desc) {
      const sortedItems = items.sort((a, b) => b.date - a.date);

      const filteredItems = JSON.stringify(sortedItems, null, 2);

      console.log(`desc: ${filteredItems}`);
    } else {
      console.log(`items: ${items}`);
    }
  });

program
  .command('price')
  .option('--asc')
  .option('--desc')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);

    if (opts.asc) {
      const sortedItems = items.sort((a, b) => a.price - b.price);

      const filteredItems = JSON.stringify(sortedItems, null, 2);

      console.log(filteredItems);
    } else if (opts.desc) {
      const sortedItems = items.sort((a, b) => b.price - a.price);

      const filteredItems = JSON.stringify(sortedItems, null, 2);

      console.log(`desc: ${filteredItems}`);
    } else {
      console.log(`items: ${items}`);
    }
  });

program
  .command('delete')
  .option('--id <id>')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);
    const index = items.findIndex((item) => item.id === Number(opts.id));

    if (index === -1) {
      console.log('dont found item');
      return;
    }

    const deletedItem = items.splice(index, 1);

    await writeFile('shopItems.json', items, true);
    console.log(`deleted: ${JSON.stringify(deletedItem, null, 2)}`);
  });

program
  .command('getById')
  .option('--id <id>')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);
    const index = items.findIndex((item) => item.id === Number(opts.id));

    console.log(items[index]);
  });

program
  .command('update')
  .option('--id <id>')
  .option('--category <category>')
  .option('--name <name>')
  .option('--price <price>')
  .action(async (opts) => {
    const items = await readFile('shopItems.json', true);
    const index = items.findIndex((item) => item.id === Number(opts.id));

    if (index === -1) {
      console.log('dont found item');
      return;
    }

    if (opts.category) items[index].category = opts.category;
    if (opts.name) items[index].name = opts.name;
    if (Number(opts.price) < 10) {
      console.log('min price is 10');
      return;
    } else {
      items[index].price = opts.price;
    }

    await writeFile('shopItems.json', items, true);

    console.log(
      `Updated successfully: ${JSON.stringify(items[index], null, 2)}`
    );
  });

program.parse();
