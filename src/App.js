import React,{useState,useEffect} from "react";
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/alert';
import { v4 as uuid } from 'uuid';
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 400},
//   { id: uuid(), charge: "credit card", amount: 1200}
// ]

//useEffects lets perform side by side effects, runs after every render
// first param - callback function- runs after render
//second param - array-for letting react know when to run useEffect
// react re-renders when state has changed or props

const initialExpenses = localStorage.getItem('expenses') ? 
JSON.parse(localStorage.getItem('expenses')) : [];

function App() {
  const [expenses,setExpenses] = useState(initialExpenses);
  const [charge,setCharge] = useState('');
  const [amount,setAmount] = useState('');
  const [alert,setAlert] = useState({show:false});
  const [edit,setEdit] = useState(false);
  const [id,setId]  = useState(0)
  useEffect(()=>{
    console.log('we called useEffect');
    localStorage.setItem('expenses',JSON.stringify(expenses))
  },[expenses]) // 2nd param- call useEffect only when there are any changes

  const handleCharge = e =>{
    //console.log(`charge: ${e.target.value}`)
    setCharge(e.target.value);
  };
  const handleAmount = e =>{
    //console.log(`amount : ${e.target.value}`)
    setAmount(e.target.value);
  };
  const handleAlert = ({type,text}) =>{
    setAlert({show:true,type,text});
    setTimeout(()=>{
      setAlert({show:false})
    },3000)
  }

  //Edit and add new
  const handleSubmit = e =>{
    e.preventDefault();
    if( charge!=="" && amount>0){
      if(edit){
        let tempExpenses = expenses.map(item =>{
          return item.id === id ? {...item,charge,amount} :item;
        }); // for the selected item to edit,if not matched keep others (:item), 
        // else add new charge and amount,store it in tempexpense array
      
        setExpenses(tempExpenses);  //edited expense list
        setEdit(false); // change the button back to submit
        handleAlert({type:'success',text:"Item edited"});
      }
      else{
        const singleExpense = {id:uuid(),charge,amount};
        setExpenses([...expenses, singleExpense]);
        handleAlert({type:'success',text:'item added'});
      }

    setCharge('');
    setAmount('');
    //console.log(charge,amount);
  
  }else{
    //handle alert called
    handleAlert({type:'danger',text:`Charge can't be empty valued`});
  }
  };

  const clearItems =()=>{
    setExpenses([]);
  }

  const handleDelete = (id)=>{
    let tempExpenses = expenses.filter(item => item.id!==id);
    setExpenses(tempExpenses)
    handleAlert({type:'danger',text:"item deleted"})
    //console.log(tempExpenses)
    //console.log(`item deleted : ${id}`);
  }

  const handleEdit= (id)=>{
      let expense = expenses.find(item => item.id === id);
      let {charge,amount} = expense;
      setCharge(charge);
      setAmount(amount);
      setEdit(true);
      setId(id)
    //console.log(`item edited : ${id}`);
  }

  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text}/>}
    <Alert></Alert>

    <h1>Budget Calculator</h1>
    <main className="App">
      <ExpenseForm 
      charge={charge} 
      amount={amount} 
      handleAmount={handleAmount}
      handleCharge={handleCharge} 
      handleSubmit={handleSubmit}
      edit={edit}/>

      <ExpenseList expenses={expenses} handleDelete={handleDelete} 
      handleEdit={handleEdit} clearItems={clearItems}/>
    </main>

    <h1>
      total spending: {" "}
      <span className="total">
        $ {expenses.reduce((acc,curr)=>{
          return (acc + parseInt(curr.amount));
        },0)}
      </span>
    </h1>
    </>
  );
}

export default App;
