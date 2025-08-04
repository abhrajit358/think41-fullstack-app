const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomers();
});

// GET all customers with optional pagination
router.get('/', (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let sql;
    let params = [];

    if (page && limit) {
        // Pagination query
        const offset = (page - 1) * limit;
        sql = 'SELECT * FROM users LIMIT ? OFFSET ?';
        params = [limit, offset];
    } else {
        // No pagination, get all customers
        sql = 'SELECT * FROM users';
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            // ... handle error
        }
        res.status(200).json({ success: true, customers: results });
    });
});

// Function to fetch all customers from the API
async function fetchCustomers() {
    const customerListDiv = document.getElementById('customerList');
    customerListDiv.innerHTML = '<p>Loading customers...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.success) {
            displayCustomerList(data.customers);
        } else {
            customerListDiv.innerHTML = <p>Error: ${data.message}</p>;
        }
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        customerListDiv.innerHTML = <p>Error fetching customers. Please check the server.</p>;
    }
}

// Function to display customers in a table format
function displayCustomerList(customers) {
    const customerListDiv = document.getElementById('customerList');
    if (customers.length === 0) {
        customerListDiv.innerHTML = '<p>No customers found.</p>';
        return;
    }

    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map(customer => `
                    <tr class="customer-row" data-id="${customer.user_id}">
                        <td>${customer.user_id}</td>
                        <td>${customer.first_name}</td>
                        <td>${customer.last_name}</td>
                        <td>${customer.email}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    customerListDiv.innerHTML = tableHtml;

    // Add event listeners to each customer row
    document.querySelectorAll('.customer-row').forEach(row => {
        row.addEventListener('click', () => {
            const customerId = row.getAttribute('data-id');
            fetchCustomerSummary(customerId);
        });
    });
}

// Function to fetch a single customer's summary (including order count)
async function fetchCustomerSummary(customerId) {
    const summaryDiv = document.getElementById('customerSummary');
    summaryDiv.innerHTML = '<p>Loading customer summary...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.success) {
            displayCustomerSummary(data.customer);
        } else {
            summaryDiv.innerHTML = <p>Error: ${data.message}</p>;
        }
    } catch (error) {
        console.error('Failed to fetch customer summary:', error);
        summaryDiv.innerHTML = <p>Error fetching summary. Please check the server.</p>;
    }
}

// Function to display the customer summary
function displayCustomerSummary(customer) {
    const summaryDiv = document.getElementById('customerSummary');
    summaryDiv.innerHTML = `
        <h3>${customer.first_name} ${customer.last_name}</h3>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Total Orders:</strong> ${customer.number_of_items || 'N/A'}</p>
    `;
}

// Function to handle search functionality
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const customerListDiv = document.getElementById('customerList');

    if (!searchTerm) {
        fetchCustomers(); // If search is empty, reload all customers
        return;
    }

    // Since you don't have a search API endpoint, we'll fetch all customers
    // and filter them on the client side. A better solution would be to create a dedicated API endpoint.
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        const data = await response.json();

        if (data.success) {
            const filteredCustomers = data.customers.filter(customer =>
                customer.first_name.toLowerCase().includes(searchTerm) ||
                customer.last_name.toLowerCase().includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm)
            );
            displayCustomerList(filteredCustomers);
        }
    } catch (error) {
        console.error('Search failed:', error);
    }
});