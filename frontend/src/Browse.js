import React, { Component } from "react";
//import "./Browse.css"
// import{Link} from 'react-router-dom';

class Browse extends Component{
    render(){
        return(
            <table>
                <tr>
                    <th>Tissue</th>
                    <th>Gene symbol</th>
                    <th>Metabolite</th>
                    <th>Curated</th>
                </tr>
                <tr>
                    <td><a href="http://db.cmdm.tw:13007/Breast">Breast</a></td>
                    <td><a href="http://db.cmdm.tw:13007/Gene">Gene</a></td>
                    <td><a href="http://db.cmdm.tw:13007/Lipid">Lipid</a></td>
                    <td><a href="http://db.cmdm.tw:13007/Lung">Lung cancaer cell exosome</a></td>
                    
                </tr>
                <tr>
                    <td><a href="http://db.cmdm.tw:13007/Lung">Lung</a></td>
                    <td><a href="http://db.cmdm.tw:13007/Protein">Proteins</a></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                <td><a href="http://db.cmdm.tw:13007/Colon">Colon</a></td>
                <td><a href="http://db.cmdm.tw:13007/miRNA">miRNA</a></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            
        )
    }
}
export default Browse


