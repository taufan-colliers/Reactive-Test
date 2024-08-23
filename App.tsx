import {Button, Image, StyleSheet, View} from 'react-native';

import {open} from '@op-engineering/op-sqlite';
import { useEffect } from 'react';

export default function HomeScreen() {
  const db = open({
    name: 'myDB',
    location: '../files/databases',
  });

  function createTable() {
    db.execute(
      `
        CREATE TABLE IF NOT EXISTS Users (
          idUser INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        );
      `,
    );
  }

  function insertData() {
    db.execute(
      `
        INSERT INTO Users(
          name
        ) VALUES (?);
      `,
      ["John"]
    );
  }

  function dropTable() {
      // const db = open(localdbConfig.inspection);

      try {
        db.execute(`DROP TABLE IF EXISTS Users;`);
      } catch (error) {
        console.log(error, 'deleting tables');
      } finally {
        // db.close();
      }
  }

  function viewTable() {
      // const db = open(localdbConfig.inspection);

      try {
        const result = db.execute(`SELECT * FROM Users;`);
        console.log(JSON.stringify(result));
      } catch (error) {
        console.log(error, 'deleting tables');
      } finally {
        // db.close();
      }
  }

  function updateRow() {
      // const db = open(localdbConfig.inspection);

      try {
        const result = db.execute(`UPDATE Users SET name = ? WHERE idUser = 1;`,['Andy']);
        console.log(JSON.stringify(result));
      } catch (error) {
        console.log(error, 'deleting tables');
      } finally {
        // db.close();
      }
  }

  useEffect(() => {
    const unsubscribe = db.reactiveExecute({
      query: `SELECT * FROM Users`,
      arguments: [],
      fireOn: [
        {
          table: 'Users',
        },
      ],
      callback: users => {
        console.log({halo: users});
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(()=>{
    let rowid = db.execute('SELECT rowid FROM Users WHERE idUser = 1');
    // console.log(rowid.item(0).rowid) => UNDEFINED

    // let unsubscribe = db.reactiveExecute({
    //   query: 'SELECT * FROM Users WHERE idUser = ?',
    //   arguments: [1],
    //   fireOn: [
    //     {
    //       table: 'Users',
    //       ids: [rowid],
    //     },
    //   ],
    //   callback: (userResponse) => {
    //     console.log(userResponse.item(0)); // should print the user whenever it updates
    //   }
    // })

    return () => {
      // unsubscribe();
    };

  },[])

  return (
    <View  style={{flex:1}}>
      <Button title="Create Table" onPress={createTable}/>
      <Button title="Insert Data" onPress={insertData}/>
      <Button title="Drop Table" onPress={dropTable}/>
      <Button title="View Table" onPress={viewTable}/>
      <Button title="Update Row" onPress={updateRow}/>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
