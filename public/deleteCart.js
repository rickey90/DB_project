function deleteCart(id){
    $.ajax({
        url: '/shopping_cart/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteFromCart(p_id, cust_id){
  $.ajax({
      url: '/shoppingCart_product/pid/' + p_id + '/cid/' + cust_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};	


function deleteProdCat(p_id, cat_id){
  $.ajax({
      url: '/product_category/pid/' + p_id + '/cid/' + cat_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};	


function deletePurRec(purchase_id, cust_id){
  $.ajax({
      url: '/purchase_record/pid/' + purchase_id + '/cid/' + cust_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};	


function deleteRecProd(purchase_id, p_id){
  $.ajax({
      url: '/precord_product/purid/' + purchase_id + '/pid/' + p_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};	


function deleteCat(cat_id){
    $.ajax({
        url: '/category/' + cat_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteProd(p_id){
    $.ajax({
        url: '/product/' + p_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};