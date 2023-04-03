import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { redirect } from 'react-router-dom';
import {Buffer} from 'buffer';

const Register = ({mediChain, ipfs, connectWallet, token, account, setToken, setAccount}) => {
    const [designation, setDesignation] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(account!=="" && designation===0){
            var record = Buffer(`Name: ${name}
Email: ${email}
Address: ${account}
Age: ${age}

`);
            ipfs.add(record).then((result, error) => {
                if(error){
                    console.log(error);
                    return;
                }else{
                    mediChain.methods.add_agent(name, age, designation, email, result.path).send({from: account}).on('transactionHash', async (hash) => {
                        redirect('/login')
                        setToken(designation)
                    })
                }
            })
        }else if(account!==""){
            mediChain.methods.add_agent(name, age, designation, email, "").send({from: account}).on('transactionHash', async (hash) => {
                setToken(designation)
                redirect('/')
            })
        }
    }

    useEffect(() => {
        if(token && account) redirect('/');
        else{
            setToken('');
            setAccount('');
        }
    }, [])

    return (
        <div className='main'>
            <h2>Register</h2>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formDesignation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Select onChange={(e) => setDesignation(e.target.value)} value={designation}>
                        <option value={0}>Patient</option>
                        <option value={1}>Doctor</option>
                        <option value={2}>Insurance Provider</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </Form.Group>
                { designation!==2 ?
                  <Form.Group className="mb-3" controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control required type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
                  </Form.Group>
                  : <></>
                }
                <Form.Group className="mb-3" controlId="formWallet">
                    <Form.Label>Connect Wallet</Form.Label>
                    { account === "" ?
                      <Form.Control type="button" value="Connect to Metamask" onClick={connectWallet}/>
                    : <Form.Control type="button" disabled value={`Connected Wallet with Address: ${account}`}/>
                    }
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}


export default Register