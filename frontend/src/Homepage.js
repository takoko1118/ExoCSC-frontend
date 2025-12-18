import React, { Component } from "react";
import { CancerType, Content } from './components/Button';import 'semantic-ui-css/semantic.min.css';
import { Button, Dropdown,Menu } from 'semantic-ui-react'

class Home extends Component{
    

    

    render(){
       
        return (
            
            
            <div className="block">
                
                <div className="bg-container">
                     <div className='wrap' >
                     
                        <div className='header'>ExoCSC</div>
                     
                        <div className="Tab">
                        
                            <div className="Tab1"><CancerType/></div> 
                            <div className="Tab2"><Content/></div> 
                        </div>    
                    </div> 

                </div>


               

                


                <div className="Intro">
                    <p className="Introtitle">Introduction of ExoCSC</p>
                    <p className="Introcontent">
                    ExoCSC provides information of exosomal proteins, RNA, lipids, and metabolites in CSC and cancer cell using text-mining. It collected published literatures including lung, breast and colon tissue type from PubMed.

                    </p>


                </div>
                
                <div>bottom </div>
             
                
            </div>
            
          

            )
            
    }
}
export default Home 
