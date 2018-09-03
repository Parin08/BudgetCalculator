//model is here =============================================================================================================//

var model=(function(){
    
    var expance=function(id,description,value){
        
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    
    
    var income=function(id,description,value){
        
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    expance.prototype.calPercentages=function(totalInc){
        
        if(totalInc>0){
            this.percentage=Math.round((this.value/totalInc)*100);
            
        }else if(totalInc<0){
           this.percentage= -1;
        }
        
     
    };
    
    expance.prototype.getUpdates=function(){
      // console.log(this.percentage);
        return this.percentage;
    };
   
    var data={
        
        arr:{
            
            exp:[],
            inc:[]
        },
        totals:{
            
            exp:0,
            inc:0
        },
        Total:0,
        percentage:-1
        
    };
    
     var sumOfIncExp=function(type){
        
        var sum=0;
        
        data.arr[type].forEach(function(cur){
            
        sum+=cur.value;
        });
       data.totals[type]=sum; 
    }
    
    
    return{
      
        addItems:function(type,description,value){
            var newitem,id;
            
            if(data.arr[type].length===0){
                id=0;
            }else{
            id=data.arr[type][data.arr[type].length-1].id+1;
            }
            if(type==='exp')
                newitem=new expance(id,description,value);
            else if(type==='inc')
                newitem=new income(id,description,value);
            
            data.arr[type].push(newitem);
            return newitem;
        },
        
        calSum:function(){
            sumOfIncExp('exp');
            
            sumOfIncExp('inc');
            
            data.Total=data.totals['inc']-data.totals['exp'];
           
            if(data.totals['inc']==0){
                data.percentage=-1;
            }
            else{
            data.percentage=Math.round((data.totals['exp']/data.totals['inc'])*100);
       
            }
        },
        
        deleteItems:function(type,id){
           var newArr, ids,t; 
           
        if(type=='income')
            t='inc';
            else if(type=='expense')
                t='exp';
           newArr= data.arr[t].map(function(cur){
                
                return cur.id;
            });
            
            
            ids=newArr.indexOf(id);
            
            if(ids !== -1){
            data.arr[t].splice(ids,1);
            }
        },
        
        calPercentage:function(){
          
            data.arr.exp.forEach(function(cur){
                
        cur.calPercentages(data.totals.inc);
            }
            
        )},
        
        getUpdate:function(){
            var per;
          per=  data.arr.exp.map(function(cur){
                   
           
       return cur. getUpdates();
             
          
         });
             
          return per;
        },
                                        
        getresult:function(){
            
            return{
                
                income:data.totals['inc'],
                expanse:data.totals['exp'],
                total:data.Total,
                percentage:data.percentage
            }
            
        }
        
    };
    
})();

//view is here =============================================================================================================//

var view=(function(){
    
    
    var strings={
        
        type:'.add__type',
        description:'.add__description',
        value:'.add__value',
        btn:'.add__btn',
        monthlabel:'.budget__title--month'
    };
    
   
    
    return{
      
        dataInsert:function(){
            
            return{
                
                type:document.querySelector(strings.type).value,
                description:document.querySelector(strings.description).value,
                value:parseFloat(document.querySelector(strings.value).value)
            }
        },
        
        
        formatNumber:function(num,type){
        
        var totalnum,front,back;
        
        num=Math.abs(num);
        num=num.toFixed(2);
        
        totalnum=num.split(".");
        front=totalnum[0];
        back=totalnum[1];
     
        if(front.length>3)
            front=front.substr(0,front.length-3)+","+front.substr(front.length-3,3);
        
        return (type==='exp'?"-":"+")+" "+front+"."+back;  
        
    },
        display:function(obj1,type){
          var html,newhtml;
            
            if(type==='exp'){
            html='<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type==='inc'){
            html='<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           newhtml=html.replace('%id%',obj1.id);
            newhtml=newhtml.replace('%description%',obj1.description);
            newhtml=newhtml.replace('%value%',this.formatNumber(obj1.value,type));
            
            if(type==='inc')
            document.querySelector('.income__list').insertAdjacentHTML('beforeend',newhtml);
            
            else if(type==='exp')
                 document.querySelector('.expenses__list').insertAdjacentHTML('beforeend',newhtml);
        },
        
        
        clearFix:function(){
          var fields,fieldsarr;
            
          fields=  document.querySelectorAll(strings.description+', '+strings.value);
            
            fieldsarr=Array.prototype.slice.call(fields);
            
            fieldsarr.forEach(function(current,index,array){
               
                current.value="";
            });
            
            fieldsarr[0].focus();
        },
        
        UIbudget:function(obj1){
            
            var type;
            if(obj1.total>=0)
                type='inc';
            else
                type='exp';
            
          document.querySelector('.budget__value').textContent=this.formatNumber(obj1.total,type);
            document.querySelector('.budget__income--value').textContent=this.formatNumber(obj1.income,'inc');
             document.querySelector('.budget__expenses--value').textContent=this.formatNumber(obj1.expanse,'exp');
            
            if(obj1.percentage>0)
            document.querySelector('.budget__expenses--percentage').textContent=obj1.percentage+"%";
            else
                 document.querySelector('.budget__expenses--percentage').textContent="---";
        },
        
        
        dltUI:function(id){
          
            document.getElementById(id).parentNode.removeChild(document.getElementById(id));
            
        },
        
        
        getDate:function(){
            
        var now,month,year,months;
            
            now=new Date(); 
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            month=now.getMonth();
            year=now.getFullYear();
            
            document.querySelector('.budget__title--month').textContent=months[month] +" "+year;
            
           
            
        },
        
        displayPersentage:function(percentages){
          
           var fields= document.querySelectorAll('.item__percentage');
            
            var nodeListForEach=function(list,callBack){
                
                for(var i=0;i<list.length;i++){
                    
                    callBack(list[i],i);
                }
                
            };
            
            nodeListForEach(fields,function(cur,index){
                
                if(percentages[index]>0){
                cur.textContent=percentages[index]+'%';
                }else if(percentages[index]===0){
                     cur.textContent='---';
          
                }
            
            
            
        });
        },
        
        
        finalTouch:function(){
            
         var fields=document.querySelectorAll(
        strings.type + ","+strings.description+","+strings.value
         );
            
             var nodeListForEach=function(list,callBack){
                
                for(var i=0;i<list.length;i++){
                    
                    callBack(list[i],i);
                }
                
            };
            
            nodeListForEach(fields,function(cur){
                
                cur.classList.toggle('red-focus');
            });
            
       document.querySelector(strings.btn).classList.toggle('red');
            
        },
        
        getStrings:function(){
        
        return strings;
    }
    };
    
    
    
})();


//controller is here =============================================================================================================//
var controller=(function(m,v){
    var DOMstrings=v.getStrings();
    
    var budgetCal=function(){
        
        
        
      m.calSum();
        
    var output=m.getresult();
       
        v.UIbudget(output);
        
    }
    
    var percentagecal=function(){
        
        m.calPercentage();
        
        var countPercentage=m.getUpdate();
        
        v.displayPersentage(countPercentage);
        
        //console.log(countPercentage);
        
        
    }
    
    var finalt=function(){
        
        v.finalTouch();
    }
    var valueInsert=function(){
        
        var input=v.dataInsert();
        if(input.description!=='' && !isNaN(input.value) && input.value>0){
        var obj1=m.addItems(input.type,input.description,input.value);
        
        v.display(obj1,input.type);
        
        v.clearFix();
            
         budgetCal();  
            
            percentagecal();
        }
    }
    
    var deleteValues=function(event){
        
      var val,ids;
        
        ids=parseInt(event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        val=event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        
       

        
        m.deleteItems(val,ids);
        
        v.dltUI(ids);
        
          budgetCal();  
        
    }
    
    var events=function(){
 document.querySelector(DOMstrings.btn).addEventListener('click',valueInsert);
    
    document.addEventListener('keypress',function(event){
        
        if(event.keyCode===13)
        valueInsert();
    });
        
        
        document.querySelector('.container').addEventListener('click',deleteValues);
        
        document.querySelector('.add__type').addEventListener('change',finalt);
    
    }
    
   
    return{
        
        init:function(){
            events();
            v.getDate();
            v.UIbudget(
            
           {
                
                income:0,
                expanse:0,
                total:0,
                percentage:-1
            });
        }
        
    };
    
    
    
})(model,view);

controller.init();