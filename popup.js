document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('myForm');
  var input = document.getElementById('myInput');
  var minprice = document.getElementById('minPrice');
  var maxprice = document.getElementById('maxPrice');
  var sortButton = document.getElementById('sortButton'); // Add this line to get the sort button element

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // prevent form submission

    //For Daraz
    // send POST request to localhost:5000/search with search keyword as the request body
    fetch('https://api.milanmahat.com.np/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value,
        min_price: minprice.value,
        max_price: maxprice.value
      })
    })
      .then(response => response.json())
      .then(data => {
        let productsHTML = ''; // Variable to store the HTML for all products

        // Function to sort the data array by price
        function sortByPriceLowToHigh() {
          console.log('Sorting by price...');
          data.forEach(product => {
            let price = String(product.price);
            price = price.replace(/[रूRs]/g, '').replace(/,/g, '').trim();
            product.price = parseFloat(price) || "N/A";
          });

          data.sort((a, b) => (typeof a.price === 'number' ? a.price : Infinity) - (typeof b.price === 'number' ? b.price : Infinity));
        }

        // Function to sort the data array by price
        function sortByPriceHighToLow() {
          console.log('Sorting by price...');
          data.forEach(product => {
            let price = String(product.price);
            price = price.replace(/[रूRs]/g, '').replace(/,/g, '').trim();
            product.price = parseFloat(price) || "N/A";
          });

          data.sort((a, b) => (typeof b.price === 'number' ? b.price : Infinity) - (typeof a.price === 'number' ? a.price : Infinity));

        }

        // Function to generate HTML for a product
        function generateProductHTML(product) {
          const productImage = product.image || "N/A";
          const productName = product.name || "N/A";
          const productUrl = "https:" + (product.productUrl || "N/A");
          const price = product.price || "N/A";
          const discount = product.discount || "N/A";
          const ratingScore = product.ratingScore || "N/A";
          const vendor = product.vendor || "N/A";

          return `<tr>
          <td class="product-image"><img src="${productImage}" alt="${productName}" style="width: 100px; height: 100px;"></td>
          <td class="product-name"><a href="${productUrl}" target="_blank">${productName}</a></td>
          <td class="product-price">Rs ${price.toLocaleString()}</td>
          <td class="product-discount">${discount}</td>
          <td class="product-rating">${ratingScore}</td>
          <td class="product-vendor">${vendor}</td>
        </tr>`;
        }

        // Sort the data array based on the selected option
        function handleSort() {
          const selectedOption = sortSelect.value;
          if (selectedOption === "lowToHigh") {
            sortByPriceLowToHigh();
          } else if (selectedOption === "highToLow") {
            sortByPriceHighToLow();
          }

          updateProductTable();
        }

        // Generate HTML for all products
        function updateProductTable() {
          console.log('Updating product table...');
          productsHTML = ''; // Reset productsHTML

          // Iterate over each product in the sorted data array
          data.forEach(product => {
            const productHTML = generateProductHTML(product);
            productsHTML += productHTML; // Append the HTML for the current product
          });

          // Update the daraz_product element with the generated HTML
          daraz_product.innerHTML = `<table class="product-table">
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Rating Score</th>
            <th>Vendor</th>
          </tr>
          ${productsHTML}
        </table>`;
        }

        // Add change event listener to the sort select element
        sortSelect.addEventListener('change', handleSort);

        // Sort the data array initially
        sortByPriceLowToHigh();

        // Generate HTML for all products initially
        updateProductTable();
      })
      .catch(error => {
        console.error(error);
        daraz_product.textContent = 'An error occurred while retrieving the product information';
      });
  });
});
