function updateCustomer(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateProduct(p_id){
    $.ajax({
        url: '/product/' + p_id,
        type: 'PUT',
        data: $('#update_product').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};