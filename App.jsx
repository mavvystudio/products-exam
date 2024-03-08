const { useState, useEffect } = React;

const AddProductForm = (props) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    props.onAddItem(inputValue);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={inputValue} onChange={handleChange} placeholder="Title"/>
    </form>
  );
}

const SearchInput = (props) => {
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    props.onSearch(inputValue);
  }, [inputValue]);
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <input value={inputValue} onChange={handleChange}/>
  );
};

const ProductItem = (props) => {
  return (
    <li>
      <span>{props.item.title}</span>
      <p>{props.item.description}</p>
      <img src={props.item.images[0]} />
    </li>
  )
}

const ProductList = (props) => {
  if (!props.items) {
    return <p>No products found.</p>
  }
  return (
    <ul>
      {props.items.map((item) => (
        <ProductItem
          key={item.id}
          item={item}
        />
      ))}
    </ul>
  )
};

const ProductApp = () => {
  const {data, query, mutate} = useDummyJson('/products');
  
  useEffect(() => {
    query();
  }, []);
  
  const handleSearch = (searchText) => {
    query(`/search?q=${searchText}`);
  };
  
  const handleOnAddItem = (title) => {
    const data = {
      title,
    };
    mutate('/add', data);
  }
  
  return (
    <div className="root">
      <SearchInput onSearch={handleSearch}/>
      <AddProductForm onAddItem={handleOnAddItem}/>
      <ProductList items={data?.products} />
    </div>
  );
};

ReactDOM.render(<ProductApp />, document.getElementById("main"));

const baseUrl = 'https://dummyjson.com';

function useDummyJson(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  
  const query = async (q = '') => {
    const url = `${baseUrl}${endpoint}${q}`;
 
    setLoading(true);
    const res = await fetch(url);
    const json = await res.json();

    setData(json);
    setLoading(false);
  };
  
  const mutate = async (resource, input) => {
    const url = `${baseUrl}${endpoint}${resource}`;
    setLoading(true);
    console.log(url , input)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    })
    await res.json();
    setLoading(false);
  };
  
  return {
    data,
    loading,
    query,
    mutate
  };

}
