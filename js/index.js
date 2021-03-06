 var oStudentInfo=document.getElementById('studentInfo');
                
                //创建学生app这个类
                var StudentApp=React.createClass({
                    //初始化 配置信息
                    getInitialState:function(){
                        return {
                            fatherData:data,
                            sex:'all',
                            deName:''
                        }
                    },
                    filterFn:function(e){//过滤男女
                        this.setState({sex:e.target.value})
                    },
                    changeName:function(e){//过滤名字
                        this.setState({deName:e.target.value})
                    },
                    componentDidMount:function(){//页面渲染完成后
                        PubSub.subscribe("delectItem",function(evName,_id){
                            var newArr = this.state.fatherData.filter(function(item){
                                return item._id !== _id
                            });
                            this.setState({fatherData:newArr});
                        }.bind(this)); 
                    },
                    render:function(){
                        return (
                            <div>
                                <h1>学员成绩信息表</h1>
                                <div className="bs-example">
                                   <div className="form-group">
                                       <label>按性别筛选</label>
                                       <select className="form-control" onChange={this.filterFn}>
                                           <option>all</option>
                                           <option>男</option>
                                           <option>女</option>
                                       </select>
                                   </div>
                                   <div className="form-group">
                                       <label>按名字筛选</label>
                                       <input type="text" className="form-control" placeholder="请输入名字" onKeyUp = {this.nameFilterHandle} onKeyUp={this.changeName} />
                                   </div>
                                   <StudentWrap  sonData={this.state.fatherData}  sexValue={this.state.sex}  cName={this.state.deName}/>
                               </div>
                            </div>
                        )
                    }
                });
                //创建学生数据父级类
                var StudentWrap=React.createClass({
            
                    render:function(){
                        //构建空数组 用来放结构
                        var arr=[];
                        var selectValue=this.props.sexValue;
                        var cName=this.props.cName;
                        //通过对象的属性获取数据
                        this.props.sonData.forEach(function(item,index){
                            
                            //通过选择的性别过滤数据
                            if(selectValue!=="all"){
                                if(!cName){//判断是否输入 要搜索的人名
                                         if( item.gender==selectValue){
                                             arr.push(<StudentData everyData={item}/>);
                                        }
                                }else{
                                         if( item.gender==selectValue ){
                                             if(cName==item.stName){
                                                arr.push(<StudentData everyData={item}/>);
                                             }
                                        }
                                }
                               
                            }else{
                                    if(!cName){
                                        arr.push(<StudentData everyData={item}/>);
                                    }else{
                                        if(cName==item.stName){
                                         arr.push(<StudentData everyData={item}/>);
                                        }
                                    }
                            }

                        })
                        return(
                            <div className="table-responsive">
                               <table className="table table-bordered table-hover">
                                   <thead>
                                       <tr>
                                           <th>姓名</th>
                                           <th>性别</th>
                                           <th>年龄</th>
                                           <th>身高（cm）</th>
                                           <th>体重（kg）</th>
                                           <th>操作</th>
                                       </tr>
                                   </thead>
                                   <tbody id="tb">
                                          {arr}
                                   </tbody>
                               </table>
                            </div> 
                        )
                    }
                });

                //创建学生数据的类
                var StudentData=React.createClass({
                    delectItem: function(){//绑定模块之间的通信
                        PubSub.publish("delectItem",this.props.everyData._id);
                    },
                    render:function(){
                        var item=this.props.everyData;//接受每一条数据 通过props
                        return(
                            <tr>
                               <td>{item.stName}</td>
                               <td>{item.gender}</td>
                               <td>{item.age}</td>
                               <td>{item.height}</td>
                               <td>{item.weigth}</td>
                               <td><a href="javascript:;" onClick = {this.delectItem} >删除</a> </td>
                            </tr> 
                        )
                    }
                })

                //渲染学生app类的结构
                ReactDOM.render(<StudentApp/>,oStudentInfo)