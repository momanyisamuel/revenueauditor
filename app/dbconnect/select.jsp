<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" import="java.sql.*" import="java.sql.DriverManager"%>
<%
	//out.println(-1);
	Connection con;
	Statement stmt;
	ResultSet rs;
	ResultSetMetaData rsmd;
	//out.println(0);
try{
		Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		con =DriverManager.getConnection("");
		stmt=con.createStatement();

		if(request.getParameter("node").toString().equals("selectnoninterestincomedate")){
			String data="{\"data\":";
			String SQL="exec banking_node_dw.dbo.selectnoninterestincomedate"+
			"  @year="+request.getParameter("year")+
			", @month="+request.getParameter("month")+
			", @branchid="+request.getParameter("branchid")+
			", @customerid="+request.getParameter("customerid");
			//out.println(SQL);
			rs=stmt.executeQuery(SQL);
			rsmd=rs.getMetaData();
			int x=0;
			while(rs.next()){
				if(x>0) data=data+",{";
				if(x==0) data=data+"[{";
				for(int i=1;i<=rsmd.getColumnCount();i++){
				   	if(i==1)data=data+"\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				   	if(i>1)data=data+",\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				}
       	data=data+"}";
       	x++;
      }
	  	data=data+"]}";
	  	//out.println(SQL);
	  	out.println(data);
	}
	if(request.getParameter("node").toString().equals("selectnoninterestincomebranch")){
			String data="{\"data\":";
			String SQL="exec banking_node_dw.dbo.selectnoninterestincomebranch"+
			"  @year="+request.getParameter("year")+
			", @month="+request.getParameter("month")+
			", @branchid="+request.getParameter("branchid")+
			", @typeid="+request.getParameter("typeid")+
			", @customerid="+request.getParameter("customerid");
			//out.println(SQL);
			rs=stmt.executeQuery(SQL);
			rsmd=rs.getMetaData();
			int x=0;
			while(rs.next()){
				if(x>0) data=data+",{";
				if(x==0) data=data+"[{";
				for(int i=1;i<=rsmd.getColumnCount();i++){
				   	if(i==1)data=data+"\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				   	if(i>1)data=data+",\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				}
       	data=data+"}";
       	x++;
      }
	  	data=data+"]}";
	  	//out.println(SQL);
	  	out.println(data);
	}
	if(request.getParameter("node").toString().equals("selectnoninterestincomecustomer")){
			String data="{\"data\":";
			String SQL="exec banking_node_dw.dbo.selectnoninterestincomecustomer"+
			"  @year="+request.getParameter("year")+
			", @month="+request.getParameter("month")+
			", @branchid="+request.getParameter("branchid")+
			", @customerid="+request.getParameter("customerid");
			//out.println(SQL);
			rs=stmt.executeQuery(SQL);
			rsmd=rs.getMetaData();
			int x=0;
			while(rs.next()){
				if(x>0) data=data+",{";
				if(x==0) data=data+"[{";
				for(int i=1;i<=rsmd.getColumnCount();i++){
				   	if(i==1)data=data+"\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				   	if(i>1)data=data+",\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				}
       	data=data+"}";
       	x++;
      }
	  	data=data+"]}";
	  	//out.println(SQL);
	  	out.println(data);
	}
	if(request.getParameter("node").toString().equals("selectrevenuetype")){
			String data="{\"data\":";
			String SQL="exec banking_node_dw.dbo.selectrevenuetype"+
			"  @revenuetypeid="+request.getParameter("revenuetypeid");
			//out.println(SQL);
			rs=stmt.executeQuery(SQL);
			rsmd=rs.getMetaData();
			int x=0;
			while(rs.next()){
				if(x>0) data=data+",{";
				if(x==0) data=data+"[{";
				for(int i=1;i<=rsmd.getColumnCount();i++){
				   	if(i==1)data=data+"\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				   	if(i>1)data=data+",\""+ rsmd.getColumnName(i)+"\":\""+rs.getString(rsmd.getColumnName(i)) + "\"";
				}
       	data=data+"}";
       	x++;
      }
	  	data=data+"]}";
	  	//out.println(SQL);
	  	out.println(data);
	}
	
}catch(Exception e){
		out.println(e);
}
%>
