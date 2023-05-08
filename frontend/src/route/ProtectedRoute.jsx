import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const ProtectedRoute = ({ isAdmin, children}) => {
    const { loading, user } = useSelector((state) => state.user);
    if (loading) {
      return <Loader/>;
    }
    if(!isAdmin && user.role !== 'admin'){
        return <Navigate to="/login"/>;
    }
    return children
};

export default ProtectedRoute;


// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Route, Navigate } from 'react-router-dom';
// import Loader from '../components/Loader';

// const ProtectedRoute = ({ isAdmin, children }) => {
//   const { loading, user } = useSelector((state) => state.user);

//   if (loading) {
//     return <Loader />;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (isAdmin && user.role !== 'admin') {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Route, Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ isAdmin, children}) => {
//     const { user } = useSelector((state) => state.user);
//     const userRole = user.role === 'admin'? true: false;
//     console.log(children)
//     if(!userRole){
//         return <Navigate to="/login" replace/>;
//     }
//     return children
// };

// export default ProtectedRoute;
