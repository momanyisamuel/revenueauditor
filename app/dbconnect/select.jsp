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
		con =DriverManager.getConnection("jdbc:sqlserver://yauro.co.za;user=allied;password=w384cc355");
		stmt=con.createStatement();

		if(request.getParameter("node").toString().equals("selectnoninterestincome")){
			String data="{\"data\":";
			String SQL="exec portal_node_dw.dbo.selectnoninterestincome "+
			"  @year="+request.getParameter("year")+
			", @month="+request.getParameter("month")+
			", @day="+request.getParameter("day")+
			", @glacc='"+request.getParameter("glacc")+"'"+
			", @branchid="+request.getParameter("branchid");
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
	if(request.getParameter("node").toString().equals("selectlist")){
		//out.println(1);
			String data="{\"data\":";
			String SQL="exec portal_node_dw.dbo.selectlist "+
			"  @parentlistid="+request.getParameter("parentlistid");
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
	if(request.getParameter("node").toString().equals("selectbranch")){
		//out.println(1);
			String data="{\"data\":";
			String SQL="exec portal_node_dw.dbo.selectdimbranch "+
			"  @branchid="+request.getParameter("branchid");
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
