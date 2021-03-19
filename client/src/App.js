import React, {useEffect, useState} from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import './index.css';
import { Drawer, Layout, Menu, Divider, Col, Row, Card, Modal, List, message, Avatar, Spin, Button } from 'antd';
import { ReadOutlined, AimOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
const { Option } = Select;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper" style={{display: "inline"}}>
    <p className="site-description-item-profile-p-label" style={{fontSize:"15px"}}>{title}:</p>
    {content}
  </div>
);

const allstates = ["Andhra Pradesh","Bihar","Karnataka","Kerala","Maharashtra","Tamil Nadu","Telangana","Uttar Pradesh","Delhi"];
const allcourses = ['EEE','ME','CE','CSE','IT'];
const children1 = [];
const children2 = [];
for (let temp of allstates) {
  children1.push(<Option key={temp}>{temp}</Option>);
}
for (let temp of allcourses) {
  children2.push(<Option key={temp}>{temp}</Option>);
}


function App() {
  const [collegedata, setdata]= useState('');
  const [states, setstates]= useState(allstates);
  const [courses, setcourses]= useState(allcourses);
  const [loading, setloading]= useState(false);
  const [hasMore, sethasMore]= useState(true);
  const [draweritem, setdrawer] = useState();
  const [visible, setvisible]= useState(false);
  const [visible2, setvisible2]= useState(false);
  const [similardata, setsimilar]= useState('');
  const [studentslist, setstudents]= useState([{id:'1',name:'sajith',year:'2020',college_id:'',skills:['a','b']}]);
  const [studentcard, setStudentCard]= useState();
  const [visible3, setvisible3]= useState(false);

  const updateData= () =>{
    if (states===[''] || courses===['']){
      axios.get(`api/allcolleges`)
      .then(res => {
        setdata(res.data);
      }).catch(error => {
        console.log(error);
      })
    }
    else {
    const data = {arg1:states, arg2:courses};
    axios.post(`api/colleges`,data)
      .then(res => {
        setdata(res.data);
      }).catch(error => {
        console.log(error);
      })
    }
  }

  const similarColleges= () =>{
      const data = {arg1:!visible?"":draweritem.city}
      axios.post(`api/similarcolleges`,data)
      .then(res => {
        setsimilar(res.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const showStudents= () =>{
    const data = {arg1:draweritem.id}
    axios.post(`api/get_students`,data)
    .then(res => {
      setstudents(res.data);
    }).catch(error => {
      console.log(error);
    })
  };  

  const onClose = () => {
    setvisible(false);
  };

  const onChildrenDrawerClose = () => {
    setvisible2(false);
  };
  const handleState = (e) => {
    setstates(e);
    updateData();
  }

  const handleCourse = (e) => {
    setcourses(e);
    updateData();
  }

  const handleInfiniteOnLoad = () => {
    let { data } = collegedata;
    setloading(true);
    if (data.length > 14) {
      message.warning('Infinite List loaded all');
        sethasMore(false);
        setloading(false);
      return;
    }
    setloading(false);
  };

  const handleInfiniteOnLoad2 = () => {
    let { data } = studentslist;
    setloading(true);
    if (data.length > 14) {
      message.warning('Infinite List loaded all');
        sethasMore(false);
        setloading(false);
      return;
    }
    setloading(false);
  };

  useEffect(() => {
    updateData();
})
  return (
   <Layout>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0
      }}
    >
      <div className="logo" />
      <label style={{color:'white', fontSize:'25px',padding:'30px'}}>FILTERS</label>
      <Menu theme="dark" mode="inline" >
        <SubMenu key="sub1" title="STATE" icon={<AimOutlined />}>
          <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Select State"
              onChange={handleState}>
                {children1}
            </Select>
        </SubMenu>
        <SubMenu key="sub2" title="SPECIALIZATION" icon={<ReadOutlined />}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Select Course"
              onChange={handleCourse}>
                {children2}
            </Select>
        </SubMenu>
      </Menu>
    </Sider>
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
         
            <div className="demo-infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={handleInfiniteOnLoad}
              hasMore={!loading && hasMore}
              useWindow={false}
            >
              <List
                dataSource={collegedata}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<a onClick={()=>{similarColleges();setvisible(true);setdrawer(item);}} key={`a-${item.id}`} >{item.name}</a>}
                      description={" Located in: "+item.city+" ,"+item.state+" ,"+item.country+".      Total Students: "+item.students}/>               
                      
                  </List.Item>
              )}>
                
              {loading && hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>
            </InfiniteScroll>
          </div>
        </div>
        </Content>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <p className="site-description-item-profile-p" style={{ marginBottom: 24, fontWeight:"bold", fontSize:"25px" }}>
            College Profile
          </p>
          <Row>
            <Col span={12}>
              <DescriptionItem title="College Name" content={!visible?"":draweritem.name} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Total Students" content={!visible?"":draweritem.students} />
            </Col>
          </Row>
          <Row>
          <Col span={12}>
              <DescriptionItem title="City" content={!visible?"":draweritem.city} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="State" content={!visible?"":draweritem.state} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Country" content={!visible?"":draweritem.country} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Website" content="-" />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Courses Offered" content={!visible?"":draweritem.courses.map((n) => n+", " )} />
            </Col>
            <Col span={12}>
              <Button onClick={()=>{setvisible2(true);showStudents();}}>Students Details</Button>
            </Col>
          </Row>
          <Divider />
          <p className="site-description-item-profile-p" style={{ marginBottom: 24, fontWeight:"bold", fontSize:"25px" }}>
            Similar Colleges
          </p>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={similardata}
            renderItem={item => (
              <List.Item>
                <Card title={item.title}>Card content</Card>
              </List.Item>
            )}
            />
          <Drawer
            title="Two-level Drawer"
            width={450}
            closable={false}
            onClose={onChildrenDrawerClose}
            visible={visible2}
          >
            <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad2}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List
            dataSource={studentslist}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a onClick={()=>{setvisible3(true);setStudentCard(item)}}>{item.name}</a>}
                  description={item.id}
                />
                <div>Content</div>
              </List.Item>
            )}
              >
                {loading && hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
                </List>
            </InfiniteScroll>
          </div>
          </Drawer>
        </Drawer>
        <Modal
          title={"Name: "+!visible3?"":studentcard.name}
          centered
          visible={visible3}
          onOk={()=>setvisible3(false)}
          onCancel={()=>setvisible3(false)}
        >
          <p>Name:  {!visible3?"":studentcard.name}</p>
          <p>Year of Admission: {!visible3?"":studentcard.year}</p>
          <p>Skills: {!visible3?"":studentcard.skills.map((n) => n+", ")}</p>
        </Modal>
      <Footer style={{ textAlign: 'center' }}>College Browser Demo 2021</Footer>
    </Layout>
  </Layout>
  );
}
export default App;
