var database = openDatabase('websql_db', '1.0', 'datastore', 2*1024*1024);

createTable();
showDetails();

function createTable(){
  database.transaction(function (transact) {
    transact.executeSql('CREATE TABLE IF NOT EXISTS items (product_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT, product_type TEXT, unit_price TEXT, product_quantity TEXT, total_price TEXT)', []);
  });
}

function saveRecord() {
  var product_name = $.trim($('#name').val());
  var product_type = $.trim($('#type').val());
  var unit_price = $.trim($('#uprice').val());
  var product_quantity = $.trim($('#pquantity').val());
  var total_price = $.trim($('#tprice').val());

  if(product_name == ''){
    alert("Please enter a product name."); $('#name').focus(); return false;
  }
  if(product_type == ''){
    alert("Please enter a product type."); $('#type').focus(); return false;
  }
  if(unit_price == ''){
    alert("Please enter a product unit price."); $('#uprice').focus(); return false;
  }
  if(product_quantity == ''){
    alert("Please enter a product quantity."); $('#pquantity').focus(); return false;
  }
  if(total_price == ''){
    alert("Please enter a total price."); $('#tprice').focus(); return false;
  }

  if(product_name != '' && product_type != '' && unit_price != '' && product_quantity != '' && total_price != ''){
    database.transaction(function (transact){
      transact.executeSql('INSERT INTO items (product_name, product_type, unit_price, product_quantity, total_price) VALUES (?, ?, ?, ?, ?)',
       [product_name, product_type, unit_price, product_quantity, total_price], showDetails(), onError);

      $('#edit_product_id').val(null);
      $('#name').val(null);
      $('#type').val(null);
      $('#uprice').val(null);
      $('#pquantity').val(null);
      $('#tprice').val(null);

    });
  }
}

function showDetails() {
  var table_data = '';
  database.transaction(function (transact){
    transact.executeSql('SELECT product_id, product_name, product_type, unit_price, product_quantity, total_price FROM items', [], function (transact, rs) {
      var resultCount = rs.rows.length;
      // alert("Total rec: "+resultCount);
      var table_header = "<thead>"
        +"<tr>"
          +"<th class='text-center'>Product Name</th>"
          +"<th class='text-center'>Product Type</th>"
          +"<th class='text-center'>Unity Price</th>"
          +"<th class='text-center'>Product Quantity</th>"
          +"<th class='text-center'>Total Price</th>"
          +"<th class='text-center col-sm-3'>Action<br/><button id='dropTableBtn' type='button' class='btn btn-outline-warning btn-danger shadow' onclick='dropTable()' style='cursor: pointer;'><span></span>Drop Table</button></th>"
        +"</tr>"
      +"</thead>";

      if(resultCount >= 1){
        for(inc = 0; inc < resultCount; inc++){
          var record = rs.rows.item(inc);

          table_data += "<tr id='trow' onclick='getRecord("+ record.product_id +")'>"
            +"<td class=''>" + record.product_name + "</td>"
            +"<td class=''>" + record.product_type + "</td>"
            +"<td class=''>" + record.unit_price + "</td>"
            +"<td class=''>" + record.product_quantity + "</td>"
            +"<td class=''>" + record.total_price + "</td>"
            +"<td class='btn-group'>"
              +"<button class='btn btn-outline-danger btn-light' type='button' onclick='deleteRecord(" + record.product_id + ")'><span></span>Delete</button>"
              +"&nbsp;&nbsp;<button class='btn btn-outline-primary btn-light' type='button' onclick='editRecord(" + record.product_id + ")'><span></span>Edit</button>"
            +"</td>"
          +"</tr>";
        }
      } else {
        $('#dropTableBtn').hide();
        table_data += "<tr>"
          +"<td class='text-center' colspan=5>No Record Found.</td>"
        +"</tr>";
      }

      var table_content = table_header + table_data;

      $('#sell_btn').show();
      $('#save_btn').show();
      $('#update_btn').hide();
      $('#displaytable').html(table_content);
    }, null);
  });
}

function getRecord(product_id) {
  database.transaction(function (transact) {
    transact.executeSql('SELECT product_id, product_name, product_type, unit_price, product_quantity, total_price FROM items WHERE product_id="'+product_id+'"', [], function (transact, rs){
    // transact.executeSql('SELECT * FROM items WHERE product_id="'+product_id+'"', [], function (transact, rs){
      var record = rs.rows.item(0);
      // alert("Total rec: "+rs.rows.length);
      $('#edit_product_id').val(record.product_id);
      $('#name').val(record.product_name);
      $('#type').val(record.product_type);
      $('#uprice').val(record.unit_price);
      $('#pquantity').val(record.product_quantity);
      $('#tprice').val(record.total_price);

      $('#sell_btn').show();
      $('#save_btn').hide();
      $('#update_btn').hide();
    }, null);
  });
}

function editRecord(product_id) {
  database.transaction(function (transact) {
    transact.executeSql('SELECT product_id, product_name, product_type, unit_price, product_quantity, total_price FROM items WHERE product_id="'+product_id+'"', [], function (transact, rs){
    // transact.executeSql('SELECT * FROM items WHERE product_id="'+product_id+'"', [], function (transact, rs){
      var record = rs.rows.item(0);
      // alert("Total rec: "+rs.rows.length);
      $('#edit_product_id').val(record.product_id);
      $('#name').val(record.product_name);
      $('#type').val(record.product_type);
      $('#uprice').val(record.unit_price);
      $('#pquantity').val(record.product_quantity);
      $('#tprice').val(record.total_price);

      $('#sell_btn').hide();
      $('#save_btn').hide();
      $('#update_btn').show();
    }, null);
  });
}

function sellRecord(product_id) {
  var product_name = $.trim($('#name').val());
  var product_type = $.trim($('#type').val());
  var unit_price = $.trim($('#uprice').val());
  var product_sell_quantity = $.trim($('#pquantity').val());
  var total_price = $.trim($('#tprice').val());
  var edit_product_id = $.trim($('#edit_product_id').val());
  var sell_reduction;

  if(product_name == ''){
    alert("Please enter a product name."); $('#name').focus(); return false
  }
  if(product_type == ''){
    alert("Please enter a product type."); $('#type').focus(); return false
  }
  if(unit_price == ''){
    alert("Please enter a product unit price."); $('#uprice').focus(); return false
  }
  if(product_sell_quantity == ''){
    alert("Please enter a product quantity."); $('#pquantity').focus(); return false
  }
  if(total_price == ''){
    alert("Please enter a total price."); $('#tprice').focus(); return false
  }

  if(product_name != '' && product_type != '' && unit_price != '' && product_sell_quantity != '' && total_price != ''){
    database.transaction(function (transact){
      transact.executeSql('SELECT * WHERE product_id = "' + product_id + '"', [], function (transact, rs){
        var record = rs.rows.item(0);
        sell_reduction = record.product_quantity - product_sell_quantity;
        alert(sell_reduction);
      });
    });

    database.transaction(function (transact){
      transact.executeSql('UPDATE product_quantity = ?, product_id = ? WHERE product_id = "' + product_id + '"', [sell_reduction, edit_product_id], function (transact, rs){
        var record = rs.rows.item(0);
      });
    });
  }
}

function deleteRecord(product_id) {
  var delete_confirm = confirm("Do you want to delete this record!");

  if(delete_confirm){
    database.transaction(function (transact) {
      transact.executeSql('DELETE FROM items WHERE product_id = "' + product_id + '"');
    }); showDetails();
  }
}

function updateRecord(){
  var product_name = $.trim($('#name').val());
  var product_type = $.trim($('#type').val());
  var unit_price = $.trim($('#uprice').val());
  var product_quantity = $.trim($('#pquantity').val());
  var total_price = $.trim($('#tprice').val());
  var edit_product_id = $.trim($('#edit_product_id').val());

  if(product_name == ''){
    alert("Please enter a product name."); $('#name').focus(); return false
  }
  if(product_type == ''){
    alert("Please enter a product type."); $('#type').focus(); return false
  }
  if(unit_price == ''){
    alert("Please enter a product unit price."); $('#uprice').focus(); return false
  }
  if(product_quantity == ''){
    alert("Please enter a product quantity."); $('#pquantity').focus(); return false
  }
  if(total_price == ''){
    alert("Please enter a total price."); $('#tprice').focus(); return false
  }

  if(product_name != '' && product_type != '' && unit_price != '' && product_quantity != '' && total_price != ''){
    database.transaction(function (transact){
      transact.executeSql('UPDATE items SET product_name = ?, product_type = ?, unit_price = ?, product_quantity = ?, total_price = ? WHERE product_id = ?', [product_name, product_type, unit_price, product_quantity, total_price, edit_product_id], showDetails(), onError);

      $('#edit_product_id').val(null);
      $('#name').val(null);
      $('#type').val(null);
      $('#uprice').val(null);
      $('#pquantity').val(null);
      $('#tprice').val(null);

      $('#sell_btn').show();
      $('#save_btn').show();
      $('#update_btn').hide();
    });
  }
}

function onError(tx, error) {
  alert(error().message);
}

function dropTable() {
  var dropTableConfirm = confirm("CAUTION:\nAll saved data will be lost\n\nWould like to continue with this action!");

  if(dropTableConfirm){
    database.transaction(function (transact){
      transact.executeSql('DROP TABLE items', []);
    });
  }
}
